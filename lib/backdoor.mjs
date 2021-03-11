import { copyFileSync } from "fs";
import express from "express";
import { checkins } from "./db.mjs";
import { PORT, BACKDOOR_PASSWORD } from "./constants.mjs";

export const activateBackdoor = () => {
  const app = express();

  app.use(express.json());
  app.use((req, res, next) => {
    const givenPassword = req.headers.authorization;
    if (givenPassword !== BACKDOOR_PASSWORD) {
      res.send("ADMIN ACCESS ONLY");
      res.status(401);
    } else {
      res.contentType("application/json");
      next();
    }
  });

  app.get("/", (req, res) => {
    res.send("TUFFYHACKS DISCORD BOT BACKDOOR");
  });

  /**
   * `req.body` is an array of emails to initialize.
   */
  app.post("/checkins", (req, res) => {
    checkins.insert(
      req.body.map((email) => ({
        email: email.toLowerCase(),
        tag: null,
      })),
      (err) => {
        res.send(err || { success: true });
      }
    );
  });

  /**
   * `req.body` is an nedb query.
   * Read: <https://github.com/louischatriot/nedb#basic-querying>
   */
  app.get("/checkins", (req, res) => {
    checkins.find(req.body, (err, docs) => {
      res.send(err || docs);
    });
  });

  app.get("/checkins/:email", (req, res) => {
    checkins.findOne({ email: req.params.email }, (err, doc) => {
      res.send(err || doc);
    });
  });

  app.post("/cleanup", (_, res) => {
    copyFileSync(
      "./checkins.db",
      `./archive/checkins/cleanup-${Date.now()}.db`
    );
    checkins.remove({}, { multi: true }, (err, numRemoved) => {
      res.send(err || { numRemoved });
    });
  });

  app.listen(PORT, () => {
    console.log(`🛰 Backdoor listening at http://localhost:${PORT}`);
  });
};
