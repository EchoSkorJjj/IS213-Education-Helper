import crypto from 'crypto';

export const generateRandomEmail = () => {
    const randomPart = crypto.randomBytes(8).toString('hex');
    return `${randomPart}@example.com`;
}