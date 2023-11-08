/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsOptions, onRequest, CallableOptions } from "firebase-functions/v2/https";

import user from "./controllers/user.controller";
import { applyMiddleware } from "./middleware";

const options: HttpsOptions | CallableOptions = { region: "eu-west1", cors: "*" };

// UNAUTHED ENDOPINTS
export const register = onRequest(options, applyMiddleware(user.register));
export const login = onRequest(options, applyMiddleware(user.login));
export const resetPassword = onRequest(options, applyMiddleware(user.resetPasswordEmail));

// AUTHED ENDPOINTS
export const logout = onCall(options, user.logout);
