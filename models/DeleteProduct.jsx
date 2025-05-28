import { db } from "../Config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
const DeleteProduct = async ({ id }) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    alert("✅ Product deleted successfully!");
  } catch (error) {
    alert("Failed to delete product.");
    console.error(error);
  }
};

export default DeleteProduct;
