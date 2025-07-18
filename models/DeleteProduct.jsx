import { db } from "../Config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
const DeleteProduct = async ({ id }) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    toast.success("Product deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete product.");
    console.error(error);
  }
};

export default DeleteProduct;
