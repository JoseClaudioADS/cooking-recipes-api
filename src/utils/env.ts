import * as z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    API_URL: z.string().url(),
    JWT_SECRET_KEY: z.string()
});

const env = envSchema.parse(process.env);

export default env;
