import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { setApiKey, send } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions } from './send-mail.interface';

@Injectable()
export class SendGridService {
    constructor(private configService: ConfigService) {
        setApiKey(configService.get<string>('mailing.apiKey'));
    }
    public async send(options: ISendMailOptions) {
        try {
            await send(options);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
