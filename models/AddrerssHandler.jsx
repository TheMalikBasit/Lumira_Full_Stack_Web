import { db } from "../Config/firebase";
import { doc, collection, updateDoc, getDoc } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const AddShippingInfo = (user, isSignedIn, newShippingInfo) => {
  return async () => {
    try {
      if (!user) return;
      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);

      let updatedShippingInfo = [];
      if (userSnapshot.exists() && isSignedIn) {
        const userData = userSnapshot.data();
        const prevShippingInfo = Array.isArray(userData.ShippingInfo)
          ? userData.ShippingInfo
          : [];
        // Assign infoIndex as length + 1
        const infoIndex = prevShippingInfo.length + 1;
        const addressWithIndex = { ...newShippingInfo, infoIndex };
        updatedShippingInfo = [...prevShippingInfo, addressWithIndex];
        await updateDoc(userRef, {
          ShippingInfo: updatedShippingInfo,
        });
      }
      toast.success("Shipping info added successfully");
    } catch (error) {
      toast.error("Failed to add shipping info");
    }
  };
};

export const updateShippingInfoByIndex = (Index, newData) => {
  return async () => {
    const { user, isSignedIn } = useUser();
    try {
      if (!user) return;
      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists() && isSignedIn) {
        const userData = userSnapshot.data();
        const allAddresses = Array.isArray(userData.ShippingInfo)
          ? userData.ShippingInfo
          : [];
        const requiredAddress = allAddresses.find(
          (addr) => addr.infoIndex === Index
        );
        const arrayIndex = allAddresses.findIndex(
          (addr) => addr.infoIndex === Index
        );

        if (arrayIndex === -1) {
          toast.error("Shipping info not found");

          return;
        }

        allAddresses[arrayIndex] = {
          ...allAddresses[arrayIndex],
          ...newData,
        };

        await updateDoc(userRef, {
          address: allAddresses,
        });
      }
      toast.success("Address updated successfully");
    } catch (error) {
      toast.error("Failed to update address");
    }
  };
};

export const fetchShippingInfoByIndex = (Index) => {
  return async () => {
    const { user } = useUser();
    try {
      if (!user) return;

      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      const allAddresses = Array.isArray(userData.ShippingInfo)
        ? userData.ShippingInfo
        : [];
      const requiredAddress = allAddresses.find(
        (addr) => addr.infoIndex === Index
      );
      toast.success("Shipping info fetched successfully");
      return requiredAddress;
    } catch (error) {
      toast.error("Failed to fetch shipping info");
    }
  };
};
