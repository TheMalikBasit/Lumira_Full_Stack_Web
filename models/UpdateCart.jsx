import { db } from "../Config/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const UpdateCart = async ({ userId, cartDataProp }) => {
  console.log("console from updateCart", cartDataProp);
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      cart: cartDataProp,
    });
    console.log("Product added to cart and uploaded to firebase");
  } catch (error) {
    console.log("Failed to add product in cart");
    console.error(error);
  }
};

export default UpdateCart;
