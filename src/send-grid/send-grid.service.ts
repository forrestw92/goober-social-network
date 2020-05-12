import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { setApiKey, send } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions } from './send-mail.interface';
import { User } from '../user/user.entity';

@Injectable()
export class SendGridService {
    constructor(private configService: ConfigService) {
        setApiKey(configService.get<string>('mailing.apiKey'));
    }
    private async send(options: ISendMailOptions) {
        try {
            await send(options);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
    public async sendConfirmEmail(user: User) {
        try {
            await this.send({
                to: user.email,
                from: this.configService.get<string>(
                    'mailing.confirmAccount.from',
                ),
                subject: this.configService.get<string>(
                    'mailing.confirmAccount.subject',
                ),
                text: `Confirm account http://localhost:3000/auth/email/confirm/${user.confirmKey}`,
                html: `Confirm account http://localhost:3000/auth/email/confirm/${user.confirmKey}`,
            });
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
