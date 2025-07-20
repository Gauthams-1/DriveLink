
// This file is intentionally left with null exports to indicate
// that the application is running in a local-only mode without
// a connection to a Firebase backend.

import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

console.warn(
  "Firebase is not configured. The application is running in local-only mode. All data will be stored in your browser's localStorage and will be lost if you clear your browser data. For persistent data, please configure your Firebase credentials."
);

export const app = null;
export const db: Firestore | null = null;
export const auth: Auth | null = null;
