import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    ignoreConfirmKeyExpiration: false,
    confirmKeyExpireTime: '1h',
    refreshTokenExpireTime: '30d',
    redirectUrlOnceConfirmed:
        process.env.NODE_ENV === 'DEVELOPMENT'
            ? 'https://localhost:3000'
            : 'https://google.com',
}));
