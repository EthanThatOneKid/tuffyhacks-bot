import { Client } from "discord.js";
import commands from "./lib/commands.mjs";
import { displayWelcomeMessage } from "./lib/helpers.mjs";
import { BOT_COMMAND_PREFIX, DISCORD_CLIENT_ID } from "./lib/constants.mjs";

const client = new Client();

client.once("ready", () => {
  displayWelcomeMessage(process.env.DISCORD_CLIENT_ID);
});

client.on("message", (message) => {
  for (const [command, executeCommand] of commands) {
    if (message.content.startsWith(BOT_COMMAND_PREFIX + command)) {
      executeCommand(message);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
