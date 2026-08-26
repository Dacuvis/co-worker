import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";

let firebaseClientAuth: Auth | null = null;

export function configureFirebase(config: Record<string, string | undefined>) {
  const firebaseConfig = {
    apiKey: config.BUN_PUBLIC_FIREBASE_API_KEY,
    authDomain: config.BUN_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: config.BUN_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: config.BUN_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.BUN_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: config.BUN_PUBLIC_FIREBASE_APP_ID,
  };

  if (Object.values(firebaseConfig).some((value) => !value)) {
    throw new Error("Firebase Web config belum dikonfigurasi di frontend/.env");
  }

  firebaseClientAuth = getAuth(getApps()[0] ?? initializeApp(firebaseConfig));
}

export async function signInWithGoogle() {
  if (!firebaseClientAuth) {
    throw new Error("Firebase Web config belum dikonfigurasi di frontend/.env");
  }

  const credential = await signInWithPopup(firebaseClientAuth, new GoogleAuthProvider());
  return {
    user: {
      uid: credential.user.uid,
      email: credential.user.email ?? undefined,
      displayName: credential.user.displayName,
      emailVerified: credential.user.emailVerified,
    },
    idToken: await credential.user.getIdToken(),
  };
}
