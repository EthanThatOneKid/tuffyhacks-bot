import Datastore from "nedb";
import { BACKDOOR_CHECKINS_DB_PATH } from "./constants.mjs";

export const checkins = new Datastore({
  filename: BACKDOOR_CHECKINS_DB_PATH,
  autoload: true,
});

checkins.ensureIndex({ fieldName: "email", unique: true });
