// models/useToggleMode.js
import { useAppContext } from "@/Context/AppContext";
import { db } from "../Config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const useToggleMode = () => {
  const { setdarkMode, darkMode } = useAppContext();
  const { user, isSignedIn } = useUser();

  return async () => {
    const userRef = user ? doc(db, "users", user.id) : null;
    const mode = !darkMode;
    try {
      if (isSignedIn && user) {
        await updateDoc(userRef, { darkMode: mode });
      }
      setdarkMode(mode);
      toast.success("Mode switched successfully");
    } catch (error) {
      toast.error("Failed to switch mode");
    }
  };
};
