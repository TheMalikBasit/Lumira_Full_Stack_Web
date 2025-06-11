import { db } from "../Config/firebase";
import { doc, collection, updateDoc, getDoc } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const AddAddress = (user, isSignedIn, newAddress) => {
  return async () => {
    try {
      if (!user) return;
      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);

      let updatedAddresses = [];
      if (userSnapshot.exists() && isSignedIn) {
        const userData = userSnapshot.data();
        const prevAddresses = Array.isArray(userData.address)
          ? userData.address
          : [];
        // Assign addressIndex as length + 1
        const addressIndex = prevAddresses.length + 1;
        const addressWithIndex = { ...newAddress, addressIndex };
        updatedAddresses = [...prevAddresses, addressWithIndex];
        await updateDoc(userRef, {
          address: updatedAddresses,
        });
      }
      toast.success("Address added successfully");
    } catch (error) {
      toast.error("Failed to add address");
    }
  };
};

export const updateAddressByIndex = (Index, newData) => {
  return async () => {
    const { user, isSignedIn } = useUser();
    try {
      if (!user) return;
      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists() && isSignedIn) {
        const userData = userSnapshot.data();
        const allAddresses = Array.isArray(userData.address)
          ? userData.address
          : [];
        const requiredAddress = allAddresses.find(
          (addr) => addr.addressIndex === Index
        );
        const arrayIndex = allAddresses.findIndex(
          (addr) => addr.addressIndex === Index
        );

        if (arrayIndex === -1) {
          toast.error("Address not found");

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

export const fetchAddressByIndex = (Index) => {
  return async () => {
    const { user } = useUser();
    try {
      if (!user) return;

      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      const allAddresses = Array.isArray(userData.address)
        ? userData.address
        : [];
      const requiredAddress = allAddresses.find(
        (addr) => addr.addressIndex === Index
      );
      toast.success("Address fetched successfully");
      return requiredAddress;
    } catch (error) {
      toast.error("Failed to fetch address");
    }
  };
};
