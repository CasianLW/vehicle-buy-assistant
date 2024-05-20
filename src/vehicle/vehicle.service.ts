import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HistoryService } from '../history/history.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly historyService: HistoryService,
  ) {}

  private async fetchOpenAIResponse(prompt: string): Promise<string> {
    const openAiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.logger.debug(`Fetching OpenAI response for prompt: ${prompt}`);
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt,
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: `Bearer ${openAiKey}`,
            },
          },
        ),
      );
      this.logger.debug(`OpenAI response: ${JSON.stringify(response.data)}`);
      return response.data.choices[0].text.trim();
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
            model: 'open-mixtral-8x22b', // Use the correct model ID
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000, // Increase the token limit if needed
            temperature: 0.7,
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
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error(`Mistral AI request failed: ${error.message}`);
      throw error;
    }
  }

  async fetchAIResponse(service: string, prompt: string): Promise<string> {
    if (service === 'openai') {
      return this.fetchOpenAIResponse(prompt);
    } else if (service === 'mistral') {
      return this.fetchMistralAIResponse(prompt);
    } else {
      throw new Error('Unsupported AI service');
    }
  }

  async processPrompt(
    userId: string,
    service: string,
    prompt: string,
  ): Promise<string> {
    const aiResponse = await this.fetchAIResponse(service, prompt);
    if (userId) {
      await this.historyService.createHistory(userId, prompt, aiResponse);
    }
    return aiResponse;
  }
}
