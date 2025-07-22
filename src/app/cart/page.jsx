// "use client";
// import React from "react";
// import { useEffect } from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "../../Context/AppContext";
// import Image from "next/image";
// import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
// import FooterOne from "@/Components/Footer";
// import FooterTwo from "@/Components/FooterTwo";
// import { Loading, LottieLoading } from "@/Components/Loading";
// import { useState } from "react";
// import OrderSummaryClassic from "@/Components/OrderSummaryClassic";
// import BackLights from "@/Components/BackLights";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import UserDetails from "@/Components/UserDetails";
// import AddAddressComponent from "@/Components/AddAddressComponent";
// import { useUser } from "@clerk/nextjs";
// import Footer from "@/Components/LumiraFooter";
// import {
//   fetchLocalCart,
//   addLocalProducts,
//   removeLocalProducts,
//   deleteLocalProducts,
// } from "../../../models/OfflineModules";
// import RenderCart from "@/Components/RenderCart";
// const cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     addToCart,
//     updateCartQuantity,
//     getCartCount,
//     setCartItems,
//     toggleItemChecked,
//     removeItemFromCart,
//     currency,
//     darkMode,
//     localCart,
//     addToLocalCart,
//     removeFromLocalCart,
//     deleteFromLocalCart,
//   } = useAppContext();

//   const [loading, setloading] = useState(true);
//   const [addAddressPopUp, setaddAddressPopUp] = useState(false);

//   useEffect(() => {
//     if (cartItems === undefined || cartItems === null) {
//       setloading(true);
//     } else {
//       setloading(false);
//     }

//     if (darkMode) {
//       document.body.style.backgroundColor = "#000000";
//       console.log("From Cart darkMode: ", darkMode);
//     } else {
//       document.body.style.backgroundColor = "#FFFFF4";
//       console.log("From Cart !darkMode: ", darkMode);
//     }
//   }, [cartItems, darkMode]);

//   if (loading) return <LottieLoading />;

//   return (
//     <>
//       <BackLights L1 L2 />
//       <Navbar relative classic />

//       {addAddressPopUp && (
//         <AddAddressComponent onClose={() => setaddAddressPopUp(false)} />
//       )}

//       <div className="w-full min-h-[60rem] pb-10">
//         <h1
//           className={`${
//             darkMode ? "text-white" : "text-black"
//           } text-center lg:text-start lg:ml-20 h1 font-code pt-10`}
//         >
//           SHOPPING CART
//         </h1>
//         <div
//           className={`${
//             darkMode ? "border-white" : "border-black"
//           } w-full border border-t my-10`}
//         />
//         <div className="flex flex-col justify-center lg:justify-normal lg:flex-row w-full px-10 lg:px-20 overflow-hidden">
//           <div className="w-full max-w-[75rem] lg:pr-20">
//             <button
//               onClick={() => router.push("/all-products")}
//               className={`hover:text-orange-500 group flex items-center mb-5 gap-2 text-sm  md:text-2xl font-poppins font-bold ${
//                 darkMode ? "text-white" : "text-black"
//               } underline`}
//             >
//               Continue Shopping
//             </button>
//             <RenderCart />
//           </div>

//           <div className="mt-[3.3rem] lg:pr-10">
//             <UserDetails openAddAddress={() => setaddAddressPopUp(true)} />
//             <OrderSummaryClassic />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default cart;

// {
//   /* <FooterOne padLinesHide white />
//       <div
//         className={`w-full border border-t ${
//           darkMode ? "border-white" : "border-black"
//         } my-5`}
//       />
//       <div
//         className={`w-full border border-t ${
//           darkMode ? "border-white" : "border-black"
//         } my-5`}
//       />
//       <FooterTwo padLinesHide white /> */
// }

"use client";
import React from "react";
import { useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext } from "../../Context/AppContext";
import Image from "next/image";
import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import FooterOne from "@/Components/Footer";
import FooterTwo from "@/Components/FooterTwo";
import { Loading, LottieLoading } from "@/Components/Loading";
import { useState } from "react";
import OrderSummaryClassic from "@/Components/OrderSummaryClassic";
import BackLights from "@/Components/BackLights";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserDetails from "@/Components/UserDetails";
import AddAddressComponent from "@/Components/AddAddressComponent";
import { useUser } from "@clerk/nextjs";
import Footer from "@/Components/LumiraFooter";
import {
  fetchLocalCart,
  addLocalProducts,
  removeLocalProducts,
  deleteLocalProducts,
} from "../../../models/OfflineModules";
import RenderCart from "@/Components/RenderCart";
const cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    setCartItems,
    toggleItemChecked,
    removeItemFromCart,
    currency,
    darkMode,
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    deleteFromLocalCart,
  } = useAppContext();

  const [loading, setloading] = useState(true);
  const [addAddressPopUp, setaddAddressPopUp] = useState(false);

  useEffect(() => {
    if (cartItems === undefined || cartItems === null) {
      setloading(true);
    } else {
      setloading(false);
    }

    if (darkMode) {
      document.body.style.backgroundColor = "#000000";
      console.log("From Cart darkMode: ", darkMode);
    } else {
      document.body.style.backgroundColor = "#FFFFF4";
      console.log("From Cart !darkMode: ", darkMode);
    }
  }, [cartItems, darkMode]);

  if (loading) return <LottieLoading />;

  return (
    <>
      <BackLights L1 L2 />
      <Navbar relative classic />

      {addAddressPopUp && (
        <AddAddressComponent onClose={() => setaddAddressPopUp(false)} />
      )}
      <div className="min-h-screen relative overflow-hidden ">
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* <h1
            className={`${
              darkMode ? "text-white" : "text-black"
            } text-center lg:text-start lg:ml-20 h1 font-code pt-10`}
          >
            SHOPPING CART
          </h1>
          <div
            className={`${
              darkMode ? "border-white" : "border-black"
            } w-full border border-t my-10`}
          /> */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <RenderCart />
            </div>
            <div className="lg:col-span-1">
              <OrderSummaryClassic />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default cart;

{
  /* <FooterOne padLinesHide white />
      <div
        className={`w-full border border-t ${
          darkMode ? "border-white" : "border-black"
        } my-5`}
      />
      <div
        className={`w-full border border-t ${
          darkMode ? "border-white" : "border-black"
        } my-5`}
      />
      <FooterTwo padLinesHide white /> */
}
