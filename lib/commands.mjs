import parseArguments from "./parse-arguments.mjs";

const cmd = {
  CHECK_IN: "checkin",
};

const commands = new Map([
  [
    cmd.CHECK_IN,
    async (message) => {
      const [email] = parseArguments(message.content);
      message.delete();
      const response = await message.channel.send(
        `Email ${email} has been verified! ✔️`
      );
      response.delete({ timeout: 2e3 });
    },
  ],
]);

export default commands;
