import type { Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
  dialect: <never>env.DATABASE_DIALECT,
  schema: env.DATABASE_SCHEMA_PATH,
  out: env.DATABASE_OUTPUT_PATH,
  dbCredentials: {
    host: env.DATABASE_HOST,
    port: parseInt(env.DATABASE_PORT, 10),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME
  }
} satisfies Config; 