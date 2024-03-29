import parseArguments from "./parse-arguments.mjs";
import { getServerStatus } from "./helpers.mjs";
import { checkins } from "./db.mjs";
import {
  CHECKIN_CHANNEL_ID,
  CHECKIN_ROLE_ID,
  BACKDOOR_DISCORD_ADMINS,
} from "./constants.mjs";

const checkIsAdmin = ({ tag }) => {
  const adminTags = BACKDOOR_DISCORD_ADMINS.split(",");
  return adminTags.indexOf(tag) > -1;
};

const checkIsDM = ({ channel }) => {
  return channel.type === "dm";
};

const checkIsCheckInChannel = (channel) => {
  return channel.id === CHECKIN_CHANNEL_ID;
};

const icons = {
  SUCCESS: "🌲",
  FAILURE: "🐻",
};

const cmd = {
  CHECK_IN: "checkin",
  STATUS: "checkedin",
  SERVER_STATUS: "status",
};

const commands = new Map([
  [
    cmd.CHECK_IN,
    async (message) => {
      if (checkIsCheckInChannel(message.channel)) {
        message.delete();
      }
      if (!checkIsCheckInChannel(message.channel)) {
        return await message.author.send(
          `> ${message.content}\nTry again in the check-in text channel.`
        );
      }
      const [email] = parseArguments(message.content);
      const err = await new Promise((res) =>
        checkins.findOne({ tag: message.author.tag }, (err, doc) =>
          err !== null
            ? res(err)
            : doc !== null
            ? res({
                message: `> ${message.content}\nYou are already checked in as \`${doc.email}\`.`,
              })
            : email === undefined || email.length === 0
            ? res({
                message: `> ${message.content}\nYou must provide the email that you used to sign up.`,
              })
            : checkins.findOne({ email: email.toLowerCase() }, (err, doc) =>
                err !== null
                  ? res(err)
                  : doc === null
                  ? res({
                      message: `> ${message.content}\nI couldn't find an email like that! Which email did you fill the Hacker RSVP Form? Try again in the check-in text channel.`,
                    })
                  : doc.tag !== null
                  ? res({
                      message: `> ${message.content}\nEmail \`${email}\` has already been checked in by ${doc.tag}.`,
                    })
                  : checkins.update(
                      { email },
                      {
                        $set: {
                          tag: message.author.tag,
                          ts: message.createdTimestamp,
                        },
                      },
                      res
                    )
              )
        )
      );
      if (err === null) {
        if (message.guild !== null) {
          const role = message.guild.roles.cache.find(
            ({ id }) => id === CHECKIN_ROLE_ID
          );
          await message.member.roles.add(role);
          message.author.send(
            `> ${message.content}\nWelcome to TuffyHacks! You have been successfully checked in as a camper! ${icons.SUCCESS}`
          );
        }
      } else {
        if (!!err.message) {
          message.author.send(err.message);
        }
      }
    },
  ],
  [
    cmd.STATUS,
    async (message) => {
      if (!checkIsDM(message)) {
        message.delete();
      }
      if (!checkIsAdmin(message.author)) {
        return message.channel.send(
          `💡 The \`${cmd.STATUS}\` command is reserved for admins.`
        );
      }
      const [email] = parseArguments(message.content);
      const { doc, err } = await new Promise((res) =>
        checkins.findOne({ email }, (err, doc) => res({ doc, err }))
      );
      // If there is no error and the document is not missing,
      // it is safe to assume that the email has been checked in.
      if (err === null && doc !== null && doc.tag !== null) {
        message.channel.send(
          `Email \`${email}\` checked in as ${doc.tag} ${icons.SUCCESS}`
        );
      } else {
        message.channel.send(
          `Email \`${email}\` has not been checked in ${icons.FAILURE}`
        );
      }
    },
  ],
  [
    cmd.SERVER_STATUS,
    async (message) => {
      if (!checkIsAdmin(message.author)) {
        return message.channel.send(
          `💡 The \`${cmd.STATUS}\` command is reserved for admins.`
        );
      }
      const {
        totalCheckins,
        totalCheckedIn,
        notYetCheckedIn,
      } = await getServerStatus();
      const percentage = Math.round((totalCheckedIn * 100) / totalCheckins);
      message.channel.send(
        [
          `\`${totalCheckins}\` have signed up.`,
          `\`${totalCheckedIn}\` have checked in on Discord.`,
          `\`${notYetCheckedIn}\` have not checked in.`,
          `\`${percentage}%\` have checked in.`,
        ].join("\n")
      );
    },
  ],
]);

export default commands;
