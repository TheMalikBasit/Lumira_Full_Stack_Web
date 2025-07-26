import { db } from "../Config/firebase";
import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const usePlaceOrder = () => {
  const { user, isSignedIn } = useUser();

  const placeOrder = async ({
    ShimpentInfo,
    orderData,
    paymentInfo,
    orderInfo,
  }) => {
    if (!isSignedIn || !user) {
      toast.error("You must be signed in to place an order");
      return;
    }

    try {
      const userRef = doc(db, "users", user.id);

      // 1. Creating the order document in `orders` collection
      const newOrderRef = await addDoc(collection(db, "orders"), {
        userId: user.id,
        shippingInfo: ShimpentInfo || {},
        orderInfo: orderData || [],
        paymentStatus: paymentInfo || "",
        orderStatus: orderInfo || {},
        createdAt: serverTimestamp(),
      });

      const orderId = newOrderRef.id;

      // 2. Appending the new order ID to the user's order history
      await updateDoc(userRef, {
        ordersHistory: arrayUnion(orderId),
      });

      toast.success("Order placed successfully");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  return { placeOrder };
};

export const orderHistory = async () => {
  const orderRef = doc(db, "orders", orders.id);
  const orderSnapshot = await getDoc(orderRef);
  const orderSnapshotData = orderSnapshot.data();
  const orderUserId = orderSnapshotData.userId;

  const allOrdersData = await getDocs(collection(db, "orders"));
  const filteredOrders = query(allOrdersData, where("userIde", "==", user.id));

  const querySnapshot = await getDocs(collection(db, "products"));
};
