import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

const serviceAccount = serviceAccountJson
  ? (() => {
    const parsed = JSON.parse(serviceAccountJson) as { project_id: string; client_email: string; private_key: string };
    return { projectId: parsed.project_id, clientEmail: parsed.client_email, privateKey: parsed.private_key.replace(/\\n/g, "\n") };
  })()
  : projectId && clientEmail && privateKey
    ? { projectId, clientEmail, privateKey }
    : undefined;

const firebaseApp = getApps()[0] ?? (serviceAccount ? initializeApp({ credential: cert(serviceAccount) }) : undefined);

if (!firebaseApp) {
  console.error("[Firebase] ERROR: Firebase Admin tidak terinisialisasi. Pastikan environment variable berikut di-set:");
  console.error("  FIREBASE_PROJECT_ID:", projectId ?? "(kosong)");
  console.error("  FIREBASE_CLIENT_EMAIL:", clientEmail ?? "(kosong)");
  console.error("  FIREBASE_PRIVATE_KEY:", privateKey ? "(ada)" : "(kosong)");
} else {
  console.log("[Firebase] Firebase Admin terinisialisasi, project:", serviceAccount?.projectId);
}

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;

if (!firestore) {
  console.error("[Firebase] ERROR: Firestore null — semua operasi database akan gagal.");
}

export const firebaseWebApiKey = process.env.FIREBASE_WEB_API_KEY;

export async function verifyFirebaseToken(token: string) {
  if (firebaseAuth) {
    return await firebaseAuth.verifyIdToken(token);
  }

  if (!firebaseWebApiKey) {
    throw new Error("Firebase Web API key is not configured");
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseWebApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token })
  });

  if (!response.ok) throw new Error("Invalid or expired Firebase token");
  const data = await response.json() as { users?: Array<{ localId: string; email?: string; displayName?: string; emailVerified?: boolean }> };
  const user = data.users?.[0];
  if (!user) throw new Error("Invalid or expired Firebase token");

  return {
    uid: user.localId,
    email: user.email,
    name: user.displayName,
    email_verified: user.emailVerified
  };
}
