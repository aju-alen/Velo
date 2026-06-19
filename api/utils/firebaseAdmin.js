import admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

let firebaseApp = null;

const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountJson) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
    return firebaseApp;
  }

  if (serviceAccountPath) {
    const absolutePath = resolve(serviceAccountPath);
    const serviceAccount = JSON.parse(readFileSync(absolutePath, "utf8"));
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return firebaseApp;
  }

  return null;
};

export const deleteFirebaseUserByPhone = async (mobileCode, mobileNumber) => {
  const app = getFirebaseApp();
  if (!app) {
    console.warn(
      "Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON to delete Firebase users."
    );
    return false;
  }

  const cleanedCode = String(mobileCode).replace(/\D/g, "");
  const cleanedNumber = String(mobileNumber).replace(/\D/g, "");
  const phoneNumber = `+${cleanedCode}${cleanedNumber}`;

  try {
    const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    await admin.auth().deleteUser(userRecord.uid);
    return true;
  } catch (err) {
    if (err?.code === "auth/user-not-found") {
      return false;
    }
    console.error("Failed to delete Firebase user by phone:", err);
    throw err;
  }
};
