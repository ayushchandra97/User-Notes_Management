import * as path from "path";
import admin from "firebase-admin";
const serviceAccount = require(path.join(
  __dirname,
  "../config/user-management-442006-firebase-adminsdk-3ygbs-f5cd6728be.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

import {newUser, updateUser, deleteUser} from "./userFunctions";
import {loginUser} from "./auth";

import {saveNotes, getNotes} from "./notesFunctions";

export {newUser, updateUser, deleteUser, saveNotes, getNotes, loginUser};
