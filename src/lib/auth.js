// src/lib/auth.js
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginComGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      nome: user.displayName,
      email: user.email,
      foto: user.photoURL,
      uid: user.uid,
      token: await user.getIdToken()
    };
  } catch (erro) {
    console.error("Erro no login:", erro);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (erro) {
    console.error("Erro ao sair:", erro);
    return false;
  }
};

export { auth };
