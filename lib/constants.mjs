import dotenv from "dotenv";

dotenv.config();

export const BOT_COMMAND_PREFIX = process.env.BOT_COMMAND_PREFIX;

export const PORT = process.env.PORT;
export const CHECKIN_ROLE_ID = process.env.CHECKIN_ROLE_ID;
export const BACKDOOR_PASSWORD = process.env.BACKDOOR_PASSWORD;
export const BACKDOOR_CHECKINS_DB_PATH = process.env.BACKDOOR_CHECKINS_DB_PATH;
export const BACKDOOR_DISCORD_ADMINS = process.env.BACKDOOR_DISCORD_ADMINS;

export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
export const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
