import { registerAs } from '@nestjs/config';

export default registerAs('mailing', () => ({
    apiKey: process.env.SEND_GRID_API,
    confirmAccount: {
        subject: 'Please confirm account.',
        from: 'no-reply@website.com',
    },
}));
