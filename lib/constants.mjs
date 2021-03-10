import dotenv from "dotenv";

dotenv.config();

export const BOT_COMMAND_PREFIX = process.env.BOT_COMMAND_PREFIX;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
export const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
