import { initializeApp, cert } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getServiceAccountCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      const jsonStr = rawEnv.startsWith("{")
        ? rawEnv
        : Buffer.from(rawEnv, "base64").toString("utf-8");
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err.message);
    }
  }

  const localKeyPath = path.resolve(__dirname, "../serviceAccount.json");
  if (fs.existsSync(localKeyPath)) {
    try {
      const fileContent = fs.readFileSync(localKeyPath, "utf-8");
      return JSON.parse(fileContent);
    } catch (err) {
      console.error("Failed to read local serviceAccount.json file:", err.message);
    }
  }

  console.warn("WARNING: No valid Firebase service account credentials found in environment variable FIREBASE_SERVICE_ACCOUNT or local serviceAccount.json file.");
  return null;
}

const serviceAccount = getServiceAccountCredential();

export const app = initializeApp({
  ...(serviceAccount ? { credential: cert(serviceAccount) } : {}),
});