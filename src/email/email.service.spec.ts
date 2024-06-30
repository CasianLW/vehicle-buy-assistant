import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'abc123' }),
  }),
}));

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'EMAIL_USER':
          return 'test@example.com';
        case 'EMAIL_PASSWORD':
          return 'password123';
        case 'EMAIL_HOST':
          return 'smtp.example.com';
        case 'EMAIL_PORT':
          return 587;
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should have valid config', () => {
    expect(configService).toBeDefined();
  });

  it('should throw an error if email credentials are missing', async () => {
    mockConfigService.get.mockReturnValueOnce(null); // Simulate missing EMAIL_USER
    await expect(
      Test.createTestingModule({
        providers: [
          EmailService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile(),
    ).rejects.toThrow('Missing email credentials');
  });

  it('should send an email using nodemailer', async () => {
    const to = 'recipient@example.com';
    const subject = 'Test Subject';
    const text = 'Hello, this is a test email.';

    await service.sendMail(to, subject, text);

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to,
      subject,
      text,
    });
  });
});

// Tests:
//
// should be defined
// should have valid config
// should throw an error if email credentials are missing
// should send an email using nodemailer
