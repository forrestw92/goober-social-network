import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    shouldConfirmKeyExpire: true,
    confirmKeyExpireTime: '1h',
}));
