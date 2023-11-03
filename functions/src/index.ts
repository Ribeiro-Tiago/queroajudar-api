/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";

import user from "./controllers/user";
import { applyMiddleware } from "./middleware";

// USER ENDOPINTS
export const register = onRequest({ region: "eu-west1", cors: ["*"] }, applyMiddleware(user.register));
