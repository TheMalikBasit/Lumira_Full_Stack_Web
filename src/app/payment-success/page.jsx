"use client";

import { useEffect } from "react";
import { db } from "../../../Config/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
  const { cartItems, shippingInfo, user } = useAppContext();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const placeOrder = async () => {
      try {
        const isStripe = params.get("session_id");
        const isCOD = params.get("method") === "cod";

        if (!cartItems || !shippingInfo || !user) return;

        const newOrder = {
          userId: user.id,
          shippingInfo,
          cartItems,
          total: cartItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          ),
          paymentStatus: isStripe ? "Paid" : "COD",
          isPaid: !!isStripe,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, "placedOrders"), newOrder);
        toast.success("Order placed successfully! 🎉");

        router.push("/order-confirmed");
      } catch (err) {
        toast.error("Failed to place order!");
        console.error(err);
      }
    };

    placeOrder();
  }, []);

  return (
    <>
      <div className="p-8 text-center">Your order is placed successfully</div>
      <div></div>
    </>
  );
}
