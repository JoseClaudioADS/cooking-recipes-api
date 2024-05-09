import * as z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    API_URL: z.string().url(),
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRATION_TIME: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    UPLOAD_FILE_PATH: z.string()
});

const env = envSchema.parse(process.env);

export default env;
