import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'env';
import ical from 'ical-generator';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService<Env>,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    attachments: Mail.Attachment[] = [],
  ) {
    try {
      this.mailService.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to,
        subject,
        text,
        attachments,
      });
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e);
      }
    }
  }

  async sendEmailWithEvent(
    email: {
      to: string;
      subject: string;
      text: string;
    },
    event: {
      name: string;
      start: Date;
      end: Date;
      summary: string;
      description: string;
      location: string;
      url: string;
      organizer: {
        name: string;
        email: string;
      };
      attendees: {
        name: string;
        email: string;
      }[];
    },
  ) {
    try {
      const {
        name,
        start,
        end,
        summary,
        description,
        location,
        url,
        organizer,
        attendees,
      } = event;

      const calendar = ical({
        name,
      });

      calendar.createEvent({
        start,
        end,
        summary,
        description,
        location,
        url,
        organizer,
        attendees,
      });

      const { to, subject, text } = email;

      this.sendEmail(to, subject, text, [
        {
          filename: 'event.ics',
          content: calendar.toString(),
          contentType: 'text/calendar',
        },
      ]);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e);
      }
    }
  }
}
