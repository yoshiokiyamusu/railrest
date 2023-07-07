import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "fazt";
export const DB_PASSWORD = process.env.DB_PASSWORD || "faztpassword";
export const DB_DATABASE = process.env.DB_DATABASE || "companydb";
export const DB_PORT = process.env.DB_PORT || 3306;
export const Open_ai_organization = process.env.Open_ai_organization;
export const Open_ai_api_key = process.env.Open_ai_api_key;
export const Youtube_key = process.env.Youtube_key;
