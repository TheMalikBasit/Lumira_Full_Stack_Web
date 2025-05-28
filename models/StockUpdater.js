import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useUser } from "@clerk/nextjs";

function StockUpdater() {
  const { user } = useUser();

  const saveUserToFirestore = async () => {
    const userRef = doc(db, "users", user.id); // Using Clerk ID as the doc ID

    await setDoc(userRef, {
      id: user.id,
      username: user.username,
      email: user.primaryEmailAddress.emailAddress,
      imageUrl: user.imageUrl,
      address: "User address here",
      orders: [],
    });

    console.log("User info saved!");
  };

  return <button onClick={saveUserToFirestore}>Save User Info</button>;
}
