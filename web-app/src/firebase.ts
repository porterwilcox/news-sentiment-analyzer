import { initializeApp } from "firebase/app";
import { Secrets } from "./secrets";

export const firebaseApp = initializeApp(Secrets.FirebaseConfig);