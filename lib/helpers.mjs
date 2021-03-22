import { checkins } from "./db.mjs";

/**
 * Read: https://discordapi.com/permissions.html#1543515200
 */
export const displayWelcomeMessage = (clientId) =>
  console.log(
    `🚀 Bot ready at https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=1543515200`
  );

export const getServerStatus = (searchQuery) =>
  new Promise((resolve) => {
    checkins.find(searchQuery, (err, docs) => {
      const totalCheckedIn = docs.reduce((total, { tag }) => {
        if (tag !== null) {
          total++;
        }
        return total;
      }, 0);
      resolve(
        err || {
          totalCheckins: docs.length,
          totalCheckedIn,
          notYetCheckedIn: docs.length - totalCheckedIn,
          checkins: docs,
        }
      );
    });
  });
