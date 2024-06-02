import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HistoryService } from '../history/history.service';
import { lastValueFrom } from 'rxjs';
import Anthropic from '@anthropic-ai/sdk';
import claudeMessage from './ai-instructions/claude-message';
import mistralMessage from './ai-instructions/mistral-message';
import OpenAI from 'openai';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);
  private readonly anthropic;
  private readonly openai: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly historyService: HistoryService,
  ) {
    const claudeApiKey = this.configService.get<string>('CLAUDE_API_KEY');
    this.anthropic = new Anthropic({ apiKey: claudeApiKey });
    const openAiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey: openAiKey });
  }

  private async fetchOpenAIResponse(prompt: string): Promise<string> {
    this.logger.debug(`Fetching OpenAI response for prompt: ${prompt}`);
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: mistralMessage },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.2,
        top_p: 1,
      });
      this.logger.debug(`OpenAI response: ${JSON.stringify(completion)}`);
      if (
        completion.choices &&
        completion.choices[0] &&
        completion.choices[0].message
      ) {
        return completion.choices[0].message.content.trim();
      } else {
        this.logger.error(
          `Invalid response structure: ${JSON.stringify(completion)}`,
        );
        throw new Error('Invalid response structure from OpenAI');
      }
    } catch (error) {
      this.logger.error(`OpenAI request failed: ${error.message}`);
      throw error;
    }
  }

  private async fetchMistralAIResponse(prompt: string): Promise<string> {
    const mistralAiKey = this.configService.get<string>('MISTRAL_API_KEY');
    this.logger.debug(`Fetching Mistral AI response for prompt: ${prompt}`);
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'https://api.mistral.ai/v1/chat/completions',
          {
            model: 'open-mistral-7b',
            // model: 'open-mixtral-8x7b',
            // model: 'open-mixtral-8x22b',
            messages: [
              { role: 'system', content: mistralMessage },
              { role: 'user', content: prompt },
            ],
            max_tokens: 2000, // Increase the token limit if needed
            temperature: 0.2,
            top_p: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${mistralAiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      this.logger.debug(
        `Mistral AI response: ${JSON.stringify(response.data)}`,
      );
      if (
        response.data.choices &&
        response.data.choices[0] &&
        response.data.choices[0].message &&
        response.data.choices[0].message.content
      ) {
        return response.data.choices[0].message.content.trim();
      } else {
        this.logger.error(
          `Invalid response structure: ${JSON.stringify(response.data)}`,
        );
        throw new Error('Invalid response structure from Mistral AI');
      }
    } catch (error) {
      this.logger.error(`Mistral AI request failed: ${error.message}`);
      throw error;
    }
  }

  private async fetchClaudeAIResponse(prompt: string): Promise<string> {
    this.logger.debug(`Fetching Claude AI response for prompt: ${prompt}`);
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        // model: 'claude-3-sonnet-20240229',
        // model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        temperature: 0,
        // system: mistralMessage,
        system: claudeMessage,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });
      this.logger.debug(`Claude AI response: ${JSON.stringify(response)}`);
      if (response.content && response.content[0] && response.content[0].text) {
        return response.content[0].text.trim();
      } else {
        this.logger.error(
          `Invalid response structure: ${JSON.stringify(response)}`,
        );
        throw new Error('Invalid response structure from Claude AI');
      }
    } catch (error) {
      this.logger.error(`Claude AI request failed: ${error.message}`);
      throw error;
    }
  }

  async fetchAIResponse(service: string, prompt: string): Promise<string> {
    if (service === 'openai') {
      return this.fetchOpenAIResponse(prompt);
    } else if (service === 'mistral') {
      return this.fetchMistralAIResponse(prompt);
    } else if (service === 'claude') {
      return this.fetchClaudeAIResponse(prompt);
    } else {
      throw new Error('Unsupported AI service');
    }
  }

  async processPrompt(
    userId: string,
    service: string,
    prompt: string,
  ): Promise<string> {
    try {
      const aiResponse = await this.fetchAIResponse(service, prompt);
      if (userId) {
        await this.historyService.createHistory(userId, prompt, aiResponse);
      }
      return aiResponse;
    } catch (error) {
      this.logger.error(`Processing prompt failed: ${error.message}`);
      throw new Error('Error processing prompt. Please try again later.');
    }
  }
}
