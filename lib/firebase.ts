import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAcfGY-ZWrEJmTG4ekAYJ-9DvSnaz6MR7g",
  authDomain: "sistemajpc1212.firebaseapp.com",
  projectId: "sistemajpc1212",
  storageBucket: "sistemajpc1212.firebasestorage.app", // ✅ corrigido
  messagingSenderId: "15679647371",
  appId: "1:15679647371:web:5e465eb7d8db6322dbae8e",
  measurementId: "G-9V9SQFBLGP",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Analytics removido para evitar problemas em produção estática
