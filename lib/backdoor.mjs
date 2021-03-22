import { copyFileSync } from "fs";
import express from "express";
import { checkins } from "./db.mjs";
import { PORT, BACKDOOR_PASSWORD } from "./constants.mjs";
import { getServerStatus } from "./helpers.mjs";
import backdoorHtml from "./backdoor.html.mjs";

export const activateBackdoor = () => {
  const app = express();

  app.use(express.json());
  app.use((req, res, next) => {
    const givenPassword = req.headers.authorization;
    if (givenPassword !== BACKDOOR_PASSWORD && req.url !== "/ui") {
      res.send("ADMIN ACCESS ONLY");
      res.status(401);
    } else {
      next();
    }
  });

  app.get("/", (req, res) => {
    res.send("TUFFYHACKS DISCORD BOT BACKDOOR");
  });

  app.get("/ui", (req, res) => {
    res.send(backdoorHtml);
  });

  /**
   * `req.body` is an array of emails to initialize.
   */
  app.post("/checkins", (req, res) => {
    try {
      checkins.insert(
        req.body.map((email) => ({
          email: email.toLowerCase(),
          tag: null,
          ts: null,
        })),
        (err) => {
          res.send(err || { success: true });
        }
      );
    } catch (error) {
      console.error(error);
      res.send({ success: false, recieved: req.body });
    }
  });

  /**
   * `req.body` is an nedb query.
   * Read: <https://github.com/louischatriot/nedb#basic-querying>
   */
  app.get("/checkins", async (req, res) =>
    res.send(await getServerStatus(req.body))
  );

  app.get("/checkins/:email", (req, res) => {
    checkins.findOne({ email: req.params.email }, (err, doc) => {
      res.send(err || doc);
    });
  });

  app.post("/cleanup", (req, res) => {
    copyFileSync(
      "./checkins.db",
      `./archive/checkins/cleanup-${Date.now()}.db`
    );
    checkins.remove(req.body || {}, { multi: true }, (err, numRemoved) => {
      res.send(err || { numRemoved });
    });
  });

  app.listen(PORT, () => {
    console.log(`🛰 Backdoor listening at http://localhost:${PORT}`);
  });
};
