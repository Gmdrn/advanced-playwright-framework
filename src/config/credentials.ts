export const credentials = {
    standardUser: process.env.STANDARD_USER ?? '',
    password: process.env.TTA_SECRET ?? '',
} as const;
