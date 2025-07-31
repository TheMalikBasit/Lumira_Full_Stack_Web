// import { useAppContext } from "@/Context/AppContext";
// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// const OrderSummaryClassic = () => {
//   const { getCartAmount, currency, darkMode, getLocalCartAmount, products } =
//     useAppContext();
//   const [shipmentCharges, setshipmentCharges] = useState(0);
//   const { isSignedIn } = useUser();
//   useEffect(() => {
//     if (getCartAmount() > 0 || getLocalCartAmount() > 0) {
//       setshipmentCharges(200);
//     } else {
//       setshipmentCharges(0);
//     }
//   }, [getCartAmount, getLocalCartAmount, products]);

//   return (
//     <div
//       className={`border ${
//         darkMode ? "border-white" : "border-black"
//       } p-5 min-w-[20rem] xl:w-[30rem]`}
//     >
//       <h1
//         className={`font-sans text-lg font-bold ${
//           darkMode ? "text-white" : "text-black"
//         }`}
//       >
//         ORDER SUMMARY
//       </h1>
//       <div className="flex flex-col items-start w-full mt-5">
//         <div className="flex flex-row w-full justify-between">
//           <h2 className="text-gray-600 text-sm">SUBTOTAL</h2>
//           <h2
//             className={`${
//               darkMode ? "text-white" : "text-black"
//             } text-sm font-bold`}
//           >
//             {currency} <span> </span>{" "}
//             {isSignedIn ? getCartAmount() : getLocalCartAmount()}
//           </h2>
//         </div>
//         <div className="flex flex-row w-full justify-between mt-3">
//           <h2 className="text-gray-600 text-sm">
//             TAX <span className="text-orange-500">2%</span>
//           </h2>
//           <h2
//             className={`${
//               darkMode ? "text-white" : "text-black"
//             } text-sm font-bold`}
//           >
//             {currency} <span> </span>
//             {Math.floor(
//               isSignedIn ? getCartAmount() * 0.02 : getLocalCartAmount() * 0.02
//             )}
//           </h2>
//         </div>
//         <div className="flex flex-row w-full justify-between mt-3">
//           <h2 className="text-gray-600 text-sm">SHIPMENT CHARGES</h2>
//           <h2
//             className={`${
//               darkMode ? "text-white" : "text-black"
//             } text-sm font-bold`}
//           >
//             {currency} <span> </span> {shipmentCharges}
//           </h2>
//         </div>
//         <div className="flex flex-row w-full justify-between mt-3">
//           <h2 className="text-gray-600 text-sm">SUBTOTAL</h2>
//           <h2
//             className={`${
//               darkMode ? "text-white" : "text-black"
//             } text-sm font-bold`}
//           >
//             {currency} <span> </span>
//             {isSignedIn
//               ? getCartAmount() +
//                 Math.floor(getCartAmount() * 0.02) +
//                 shipmentCharges
//               : getLocalCartAmount() +
//                 Math.floor(getLocalCartAmount() * 0.02) +
//                 shipmentCharges}
//           </h2>
//         </div>
//       </div>
//       <button
//         className={`${
//           darkMode ? "bg-white text-black" : "bg-neutral-800 text-neutral-50"
//         } w-full p-4 mt-5`}
//       >
//         CHECKOUT
//       </button>
//     </div>
//   );
// };

// export default OrderSummaryClassic;

// // "use client";

// // import { useAppContext } from "@/Context/AppContext";
// // import { useEffect, useState } from "react";
// // import { useUser } from "@clerk/nextjs";

// // const OrderSummaryClassic = () => {
// //   const { getCartAmount, getLocalCartAmount, currency, darkMode, products } =
// //     useAppContext();
// //   const { isSignedIn } = useUser();
// //   const [shipmentCharges, setShipmentCharges] = useState(0);

// //   useEffect(() => {
// //     const amount = isSignedIn ? getCartAmount() : getLocalCartAmount();
// //     setShipmentCharges(amount > 0 ? 200 : 0);
// //   }, [isSignedIn, getCartAmount, getLocalCartAmount, products]);

// //   const subtotal = isSignedIn ? getCartAmount() : getLocalCartAmount();
// //   const tax = Math.floor(subtotal * 0.02);
// //   const total = subtotal + tax + shipmentCharges;

// //   return (
// //     <div
// //       className={`border p-6 rounded-md ${
// //         darkMode ? "border-white text-white" : "border-black text-black"
// //       } xl:w-[30rem]`}
// //     >
// //       <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>
// //       <div className="space-y-4">
// //         <div className="flex justify-between text-sm">
// //           <span className="text-n-muted_foreground">Subtotal</span>
// //           <span>
// //             {currency}
// //             {subtotal}
// //           </span>
// //         </div>
// //         <div className="flex justify-between text-sm">
// //           <span className="text-n-muted_foreground">
// //             Tax <span className="text-orange-500">(2%)</span>
// //           </span>
// //           <span>
// //             {currency}
// //             {tax}
// //           </span>
// //         </div>
// //         <div className="flex justify-between text-sm">
// //           <span className="text-n-muted_foreground">Shipment Charges</span>
// //           <span>
// //             {currency}
// //             {shipmentCharges}
// //           </span>
// //         </div>
// //         <hr className="my-4" />
// //         <div className="flex justify-between text-lg font-bold">
// //           <span>Total</span>
// //           <span>
// //             {currency}
// //             {total}
// //           </span>
// //         </div>
// //       </div>
// //       <button
// //         className={`mt-6 w-full py-3 font-semibold ${
// //           darkMode ? "bg-white text-black" : "bg-neutral-800 text-white"
// //         }`}
// //       >
// //         Checkout
// //       </button>
// //     </div>
// //   );
// // };

// // export default OrderSummaryClassic;

// "use client";
// import React from "react";
// import { useAppContext } from "@/Context/AppContext";
// import { useUser } from "@clerk/nextjs";
// import { LoadingDiv } from "@/Components/Loading";
// import { useEffect } from "react";
// import Image from "next/image";
// import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

// const RenderCart = () => {
//   const {
//     products,
//     cartItems,
//     addToCart,
//     updateCartQuantity,
//     currency,
//     router,
//     loading,
//     setLoading,
//     removeItemFromCart,
//     darkMode,
//     localCart,
//     addToLocalCart,
//     removeFromLocalCart,
//     deleteFromLocalCart,
//     getCartCount,
//     setCartItems,
//     toggleItemChecked,
//     toggleLocalItemCheck,
//   } = useAppContext();
//   const { isSignedIn } = useUser();
//   useEffect(() => {
//     if (isSignedIn) {
//       if (cartItems === undefined || cartItems === null) {
//         setLoading(true);
//       } else {
//         setLoading(false);
//       }
//     } else {
//       setLoading(false);
//     }
//     console.log("From RenderCart isSignedIn: ", isSignedIn);
//     if (darkMode) {
//       document.body.style.backgroundColor = "#000000";
//       console.log("From Cart darkMode: ", darkMode);
//     } else {
//       document.body.style.backgroundColor = "#FFFFF4";
//       console.log("From Cart !darkMode: ", darkMode);
//     }
//   }, [cartItems, isSignedIn, localCart]);

//   console.log("From RenderCart localCart: ", localCart);
//   console.log("From RenderCart products: ", products);

//   if (loading) return <LoadingDiv />;

//   return (
//     <div>
//       {isSignedIn ? (
//         cartItems?.length > 0 ? (
//           <div
//             className={`border ${darkMode ? "border-white" : "border-black"} `}
//           >
//             <div className="overflow-y-auto max-h-[44.4rem] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300">
//               {cartItems.map((item) => {
//                 const product = products.find(
//                   (product) => product.id === item.itemId
//                 );

//                 if (!product) return null;

//                 return (
//                   <div
//                     key={item.itemId}
//                     className={`border-b w-full ${
//                       darkMode ? "border-white" : "border-black"
//                     }`}
//                   >
//                     <div className="flex items-center flex-row w-full p-5 md:p-10">
//                       <button
//                         type="button"
//                         onClick={() => toggleItemChecked(item.itemId)}
//                         className="text-2xl md:text-4xl mr-2 md:mr-5"
//                         aria-pressed={item.checked}
//                       >
//                         <FontAwesomeIcon
//                           icon={item.checked ? faCheckSquare : faSquare}
//                           className={`${
//                             darkMode ? "text-white" : "text-black"
//                           }`}
//                         />
//                       </button>

//                       <div
//                         className="mr-2 md:mr-5"
//                         onClick={() => router.push("/product/" + product.id)}
//                       >
//                         <Image
//                           src={product.mainImage}
//                           width={100}
//                           height={100}
//                           alt={product.name}
//                           className={`border ${
//                             darkMode ? "border-white" : "border-black"
//                           } min-w-[100px] min-h-[100px] w-[200px] cursor-pointer object-contain`}
//                         />
//                       </div>
//                       <div className="flex flex-col w-full justify-around">
//                         <div className="flex w-full justify-between items-center mb-2 md:mb-6">
//                           <h2
//                             onClick={() =>
//                               router.push("/product/" + product.id)
//                             }
//                             className={`font-mono font-bold ${
//                               darkMode ? "text-white" : "text-black"
//                             } text-sm md:text-2xl cursor-pointer`}
//                           >
//                             {product.name}
//                           </h2>
//                           <button
//                             onClick={() => updateCartQuantity(product.id, 0)}
//                           >
//                             <FontAwesomeIcon
//                               icon={faXmark}
//                               className={`${
//                                 darkMode ? "text-white" : "text-black"
//                               } top-0 right-0 md:text-xl`}
//                               size="sm"
//                             />
//                           </button>
//                         </div>
//                         <div className="flex flex-row justify-end md:justify-between mb-2 md:mb-6">
//                           <div
//                             className={`hidden md:flex p-2 border ${
//                               darkMode ? "border-white" : "border-black"
//                             } w-20`}
//                           >
//                             <h2
//                               className={`${
//                                 darkMode ? "text-white" : "text-black"
//                               }`}
//                             >
//                               Hello
//                             </h2>
//                           </div>
//                           {/* <div className="hidden md:flex p-2 border border-black w-20">
//                                     <h2 className=" text-black">Hello</h2>
//                                   </div> */}
//                           <div
//                             className={`p-2 border ${
//                               darkMode ? "border-white" : "border-black"
//                             } w-24 flex justify-between items-center`}
//                           >
//                             <button
//                               className={`${
//                                 darkMode ? "text-white" : "text-black"
//                               } font-code text-sm md:text-lg font-bold`}
//                               onClick={() =>
//                                 updateCartQuantity(
//                                   item.itemId,
//                                   item.quantity - 1
//                                 )
//                               }
//                             >
//                               -
//                             </button>
//                             <h1
//                               className={`font-poppins text-sm md:text-lg font-bold ${
//                                 darkMode ? "text-white" : "text-black"
//                               }`}
//                             >
//                               {item.quantity}
//                             </h1>
//                             <button
//                               className={`${
//                                 darkMode ? "text-white" : "text-black"
//                               } font-code text-sm md:text-lg font-bold`}
//                               onClick={() =>
//                                 updateCartQuantity(
//                                   item.itemId,
//                                   item.quantity + 1
//                                 )
//                               }
//                             >
//                               +
//                             </button>
//                           </div>
//                         </div>
//                         <div className="flex flex-row justify-between items-center w-full">
//                           <h1
//                             className={`hidden md:flex text-sm lg:text-lg font-poppins lg:font-bold ${
//                               darkMode ? "text-white" : "text-black"
//                             } underline cursor-pointer`}
//                           >
//                             MOVE TO FAVOURITES
//                           </h1>
//                           <FontAwesomeIcon
//                             icon={faHeart}
//                             className={`flex md:hidden ${
//                               item.checked ? "text-red-500" : "text-black"
//                             }  text-xl md:text-2xl`}
//                           />
//                           <h1 className="text-sm  lg:text-lg  font-poppins font-bold text-black">
//                             {currency} <span> </span>
//                             {(product.price * item.quantity).toFixed(2)}
//                           </h1>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ) : (
//           <p
//             className={`font-poppins text-2xl ${
//               darkMode ? "text-white" : "text-black"
//             } underline cursor-pointer ml-40`}
//           >
//             Your cart is empty.
//           </p>
//         )
//       ) : localCart?.length > 0 ? (
//         <div
//           className={`border ${darkMode ? "border-white" : "border-black"} `}
//         >
//           <div className="overflow-y-auto max-h-[44.4rem] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300">
//             {localCart.map((item) => {
//               const product = products.find(
//                 (product) => product.id === item.id
//               );

//               if (!product) return null;

//               return (
//                 <div
//                   key={item.id}
//                   className={`border-b w-full ${
//                     darkMode ? "border-white" : "border-black"
//                   }`}
//                 >
//                   <div className="flex items-center flex-row w-full p-5 md:p-10">
//                     <button
//                       type="button"
//                       onClick={() => toggleLocalItemCheck(item.id)}
//                       className="text-2xl md:text-4xl mr-2 md:mr-5"
//                       aria-pressed={item.checked}
//                     >
//                       <FontAwesomeIcon
//                         icon={item.checked ? faCheckSquare : faSquare}
//                         className={`${darkMode ? "text-white" : "text-black"}`}
//                       />
//                     </button>

//                     <div
//                       className="mr-2 md:mr-5"
//                       onClick={() => router.push("/product/" + product.id)}
//                     >
//                       <Image
//                         src={product.mainImage}
//                         width={100}
//                         height={100}
//                         alt={product.name}
//                         className={`border ${
//                           darkMode ? "border-white" : "border-black"
//                         } min-w-[100px] min-h-[100px] w-[200px] cursor-pointer object-contain`}
//                       />
//                     </div>
//                     <div className="flex flex-col w-full justify-around">
//                       <div className="flex w-full justify-between items-center mb-2 md:mb-6">
//                         <h2
//                           onClick={() => router.push("/product/" + product.id)}
//                           className={`font-mono font-bold ${
//                             darkMode ? "text-white" : "text-black"
//                           } text-sm md:text-2xl cursor-pointer`}
//                         >
//                           {product.name}
//                         </h2>
//                         <button onClick={() => deleteFromLocalCart(item.id)}>
//                           <FontAwesomeIcon
//                             icon={faXmark}
//                             className={`${
//                               darkMode ? "text-white" : "text-black"
//                             } top-0 right-0 md:text-xl`}
//                             size="sm"
//                           />
//                         </button>
//                       </div>
//                       <div className="flex flex-row justify-end md:justify-between mb-2 md:mb-6">
//                         <div
//                           className={`hidden md:flex p-2 border ${
//                             darkMode ? "border-white" : "border-black"
//                           } w-20`}
//                         >
//                           <h2
//                             className={`${
//                               darkMode ? "text-white" : "text-black"
//                             }`}
//                           >
//                             Hello
//                           </h2>
//                         </div>
//                         {/* <div className="hidden md:flex p-2 border border-black w-20">
//                                     <h2 className=" text-black">Hello</h2>
//                                   </div> */}
//                         <div
//                           className={`p-2 border ${
//                             darkMode ? "border-white" : "border-black"
//                           } w-24 flex justify-between items-center`}
//                         >
//                           <button
//                             className={`${
//                               darkMode ? "text-white" : "text-black"
//                             } font-code text-sm md:text-lg font-bold`}
//                             onClick={() => removeFromLocalCart(item.id)}
//                           >
//                             -
//                           </button>
//                           <h1
//                             className={`font-poppins text-sm md:text-lg font-bold ${
//                               darkMode ? "text-white" : "text-black"
//                             }`}
//                           >
//                             {item.quantity}
//                           </h1>
//                           <button
//                             className={`${
//                               darkMode ? "text-white" : "text-black"
//                             } font-code text-sm md:text-lg font-bold`}
//                             onClick={() => addToLocalCart(item.id)}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                       <div className="flex flex-row justify-between items-center w-full">
//                         <h1
//                           className={`hidden md:flex text-sm lg:text-lg font-poppins lg:font-bold ${
//                             darkMode ? "text-white" : "text-black"
//                           } underline cursor-pointer`}
//                         >
//                           MOVE TO FAVOURITES
//                         </h1>
//                         <FontAwesomeIcon
//                           icon={faHeart}
//                           className={`flex md:hidden ${
//                             item.checked ? "text-red-500" : "text-black"
//                           }  text-xl md:text-2xl`}
//                         />
//                         <h1 className="text-sm  lg:text-lg  font-poppins font-bold text-black">
//                           {currency} <span> </span>
//                           {(product.price * item.quantity).toFixed(2)}
//                         </h1>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ) : (
//         <p
//           className={`font-poppins text-2xl ${
//             darkMode ? "text-white" : "text-black"
//           } underline cursor-pointer ml-40`}
//         >
//           Your cart is empty.
//         </p>
//       )}
//     </div>
//   );
// };

// export default RenderCart;

// QuickCart OrderSummary
// "use client";
// import { addressDummyData } from "../assets/assets";
// import { useAppContext } from "../Context/AppContext";
// import React, { useEffect, useState } from "react";

// const OrderSummary = () => {
//   const { currency, router, getCartCount, getCartAmount, darkMode } =
//     useAppContext();
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const [userAddresses, setUserAddresses] = useState([]);

//   const fetchUserAddresses = async () => {
//     setUserAddresses(addressDummyData);
//   };

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const createOrder = async () => {};

//   useEffect(() => {
//     fetchUserAddresses();
//   }, []);

//   return (
//     <div
//       className={`mt-20 w-full md:w-96 p-5 border ${
//         darkMode ? "border-white" : "border-black"
//       }`}
//     >
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">
//         Order Summary
//       </h2>
//       <hr className="border-gray-500/30 my-5" />
//       <div className="space-y-6">
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Select Address
//           </label>
//           <div className="relative inline-block w-full text-sm border">
//             <button
//               className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               <span>
//                 {selectedAddress
//                   ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
//                   : "Select Address"}
//               </span>
//               <svg
//                 className={`w-5 h-5 inline float-right transition-transform duration-200 ${
//                   isDropdownOpen ? "rotate-0" : "-rotate-90"
//                 }`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="#6B7280"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.map((address, index) => (
//                   <li
//                     key={index}
//                     className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
//                     onClick={() => handleAddressSelect(address)}
//                   >
//                     {address.fullName}, {address.area}, {address.city},{" "}
//                     {address.state}
//                   </li>
//                 ))}
//                 <li
//                   onClick={() => router.push("/add-address")}
//                   className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
//                 >
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Promo Code
//           </label>
//           <div className="flex flex-col items-start gap-3">
//             <input
//               type="text"
//               placeholder="Enter promo code"
//               className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
//             />
//             <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
//               Apply
//             </button>
//           </div>
//         </div>

//         <hr className="border-gray-500/30 my-5" />

//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">
//               {currency}
//               {getCartAmount()}
//             </p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">Free</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">
//               {currency}
//               {Math.floor(getCartAmount() * 0.02)}
//             </p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>
//               {currency}
//               {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
//             </p>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={createOrder}
//         className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// };

// export default OrderSummary;

//All Garbaged Pages

//All Products Page
// "use client";
// import ProductCard from "../../Components/ProductCard";
// import Navbar from "../../components/Navbar";
// import Footer from "../../Components/Footer";
// import { useAppContext } from "../../Context/AppContext";
// import DefaultStyler from "@/Components/DefaultStyler";
// import FooterOne from "../../Components/Footer";
// import FooterTwo from "@/Components/FooterTwo";
// import { useEffect, useState } from "react";
// import { Loading, LottieLoading } from "@/Components/Loading";

// const AllProducts = ({ hidden }) => {
//   const { products } = useAppContext();
//   const [loading, setloading] = useState(true);

//   useEffect(() => {
//     if (products === undefined || products === null) {
//       setloading(true);
//     } else {
//       setloading(false);
//     }
//   }, [products]);

//   if (loading) return <LottieLoading />;
//   return (
//     <>
//       <Navbar relative hidden={hidden} />
//       <DefaultStyler>
//         <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-[50rem]">
//           <div className="flex flex-col items-end pt-12">
//             <p className="text-2xl font-medium">All products</p>
//             <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
//             {Array.isArray(products) &&
//               products.map((item, index) => (
//                 <ProductCard key={index} product={item} />
//               ))}
//           </div>
//         </div>

//         <FooterOne crosses hidden={hidden} />

//         <FooterTwo crosses hidden={hidden} />
//       </DefaultStyler>
//     </>
//   );
// };

// export default AllProducts;

//Specific Product Page
// "use client";
// import { useEffect, useState } from "react";
// import { assets } from "../../../assets/assets";
// import ProductCard from "../../../Components/ProductCard";
// import Navbar from "../../../components/Navbar";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { Loading, LottieLoading } from "../../../components/Loading";
// import { useAppContext } from "../../../Context/AppContext";
// import React from "react";
// import FooterOne from "../../../components/Footer";
// import FooterTwo from "@/Components/FooterTwo";

// const Product = () => {
//   const { id } = useParams();

//   const {
//     products,
//     router,
//     addToCart,
//     currency,
//     cartItems,
//     updateCartQuantity,
//     loading,
//   } = useAppContext();

//   const [mainImage, setMainImage] = useState(null);
//   const [productData, setProductData] = useState(null);
//   // const [cartQuantity, setcartQuantity] = useState(0);
//   // const [item, setitem] = useState([]);

//   const fetchProductData = async () => {
//     const product = products.find((product) => product.id === id);
//     setProductData(product);
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, [id, products.length]);
//   // const fetchedProduct = cartItems.find((cartItem) => cartItem.itemId === id);
//   // console.log("Fetched product: ", fetchedProduct);
//   // const quantity = fetchedProduct ? fetchedProduct.quantity : 0;
//   // console.log("Fetched product quantity", quantity);

//   // useEffect(() => {
//   //   quantityChecker();
//   // }, [cartItems, id]);

//   // const quantityChecker = () => {
//   //   const cartProduct = cartItems.find((cartItem) => cartItem.itemId === id);
//   //   setcartQuantity(cartProduct ? cartProduct.quantity : 0);
//   //   setitem(cartProduct);
//   //   console.log("From quantity checker", item);
//   //   console.log("From quantity checker", cartProduct);
//   // };

//   if (loading || !productData || !cartItems) return <LottieLoading />;
//   const cartProduct = cartItems.find((cartItem) => cartItem.itemId === id);
//   const cartQuantity = cartProduct ? cartProduct.quantity : 0;

//   console.log("Cart Items : ", cartItems);
//   console.log("Fetched product: ", cartProduct);
//   console.log("Fetched product quantity: ", cartQuantity);
//   console.log("Product Data: ", productData);
//   return (
//     <>
//       <Navbar relative />
//       <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10 bg-neutral-300">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
//           <div className="px-5 lg:px-16 xl:px-20">
//             <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
//               <Image
//                 src={mainImage || productData.mainImage}
//                 alt="alt"
//                 className="w-full h-auto object-cover mix-blend-multiply"
//                 width={1280}
//                 height={720}
//               />
//             </div>

//             <div className="grid grid-cols-4 gap-4">
//               <div
//                 onClick={() => setMainImage(productData.mainImage)}
//                 className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
//               >
//                 <Image
//                   src={productData.mainImage}
//                   alt="alt"
//                   className="w-full h-auto object-cover mix-blend-multiply"
//                   width={1280}
//                   height={720}
//                 />
//               </div>
//               {productData.imageUrl.map((image, index) => (
//                 <div
//                   key={index}
//                   onClick={() => setMainImage(image)}
//                   className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
//                 >
//                   <Image
//                     src={image}
//                     alt="alt"
//                     className="w-full h-auto object-cover mix-blend-multiply"
//                     width={1280}
//                     height={720}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
//               {productData.name}
//             </h1>
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-0.5">
//                 <Image
//                   className="h-4 w-4"
//                   src={assets.star_icon}
//                   alt="star_icon"
//                 />
//                 <Image
//                   className="h-4 w-4"
//                   src={assets.star_icon}
//                   alt="star_icon"
//                 />
//                 <Image
//                   className="h-4 w-4"
//                   src={assets.star_icon}
//                   alt="star_icon"
//                 />
//                 <Image
//                   className="h-4 w-4"
//                   src={assets.star_icon}
//                   alt="star_icon"
//                 />
//                 <Image
//                   className="h-4 w-4"
//                   src={assets.star_dull_icon}
//                   alt="star_dull_icon"
//                 />
//               </div>
//               <p>(4.5)</p>
//             </div>
//             <p className="text-gray-600 mt-3">{productData.description}</p>
//             <p className="text-3xl font-medium mt-6">
//               {/* offerPrice */}
//               {currency}
//               {productData.price}
//               <span className="text-base font-normal text-gray-800/60 line-through ml-2">
//                 {currency}
//                 {productData.price}
//               </span>
//             </p>
//             <hr className="bg-gray-600 my-6" />
//             <div className="overflow-x-auto">
//               <table className="table-auto border-collapse w-full max-w-72">
//                 <tbody>
//                   <tr>
//                     <td className="text-gray-600 font-medium">Brand</td>
//                     <td className="text-gray-800/50 ">Generic</td>
//                   </tr>
//                   <tr>
//                     <td className="text-gray-600 font-medium">Color</td>
//                     <td className="text-gray-800/50 ">Multi</td>
//                   </tr>
//                   <tr>
//                     <td className="text-gray-600 font-medium">Category</td>
//                     <td className="text-gray-800/50">
//                       {productData.availableStock}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="text-gray-600 font-medium">Stock</td>
//                     <td className="text-gray-800/50">
//                       {productData.availableStock}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex items-center mt-10 gap-4">
//               <button
//                 onClick={() => addToCart(productData.id)}
//                 className={`${
//                   cartProduct ? "hidden" : "block"
//                 } w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition`}
//               >
//                 Add to Cart
//               </button>
//               <div
//                 className={`${cartProduct ? "block" : "hidden"} flex w-full `}
//               >
//                 <div className="p-2 border border-black min-w-24 flex justify-between items-center mr-5">
//                   <button
//                     className="text-black font-code text-sm md:text-lg font-bold"
//                     onClick={() =>
//                       updateCartQuantity(
//                         cartProduct.itemId,
//                         cartProduct.quantity - 1
//                       )
//                     }
//                   >
//                     -
//                   </button>
//                   <h1 className="font-poppins text-sm md:text-lg font-bold text-black">
//                     {cartProduct ? cartProduct.quantity : 0}
//                   </h1>
//                   <button
//                     className="text-black font-code text-sm md:text-lg font-bold"
//                     onClick={() =>
//                       updateCartQuantity(
//                         cartProduct.itemId,
//                         cartProduct.quantity + 1
//                       )
//                     }
//                   >
//                     +
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => {
//                     router.push("/cart");
//                   }}
//                   className={`w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition`}
//                 >
//                   Buy now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col items-center">
//           <div className="flex flex-col items-center mb-4 mt-16">
//             <p className="text-3xl font-medium">
//               Featured{" "}
//               <span className="font-medium text-orange-600">Products</span>
//             </p>
//             <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
//             {products.slice(0, 5).map((product, index) => (
//               <ProductCard key={index} product={product} />
//             ))}
//           </div>
//           <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
//             See more
//           </button>
//         </div>
//       </div>
//       <FooterOne />
//       <FooterTwo />
//     </>
//   );
// };

// export default Product;

//Sample Cart Page
// "use client";
// import React from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "../../Context/AppContext";

// const sampleCart = () => {
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
//   } = useAppContext();

//   return (
//     <>
//       <Navbar relative />
//       <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
//             <p className="text-2xl md:text-3xl text-gray-500">
//               Your <span className="font-medium text-orange-600">Cart</span>
//             </p>
//             <p className="text-lg md:text-xl text-gray-500/80">
//               {getCartCount()} Items
//             </p>
//           </div>
//           <div className="overflow-x-auto">
//             {cartItems?.length > 0 ? (
//               <table className="min-w-full table-auto">
//                 <thead className="text-left">
//                   <tr>
//                     <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-400 font-medium">
//                       Product Details
//                     </th>
//                     <th className="pb-6 md:px-4 px-1 text-gray-400 font-medium">
//                       Price
//                     </th>
//                     <th className="pb-6 md:px-4 px-1 text-gray-400 font-medium">
//                       Quantity
//                     </th>
//                     <th className="pb-6 md:px-4 px-1 text-gray-400 font-medium">
//                       Subtotal
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cartItems.map((item) => {
//                     const product = products.find(
//                       (product) => product.id === item.itemId
//                     );

//                     if (!product) return null;

//                     return (
//                       <tr key={item.itemId}>
//                         <td className="py-4 md:px-4">
//                           <input
//                             type="checkbox"
//                             checked={item.checked}
//                             onChange={() => {
//                               toggleItemChecked(item.itemId);
//                             }}
//                           />
//                         </td>
//                         <td className="py-4 md:px-4">{product.name}</td>
//                         <td className="py-4 md:px-4">${product.price}</td>
//                         <td className="py-4 md:px-4">
//                           <button
//                             disabled={item.quantity <= 1} // Prevent going below 1
//                             onClick={() =>
//                               updateCartQuantity(item.itemId, item.quantity - 1)
//                             }
//                           >
//                             -
//                           </button>
//                           {item.quantity}
//                           <button
//                             onClick={() =>
//                               updateCartQuantity(item.itemId, item.quantity + 1)
//                             }
//                           >
//                             +
//                           </button>
//                         </td>
//                         <td className="py-4 md:px-4">
//                           ${(product.price * item.quantity).toFixed(2)}
//                         </td>
//                         <td className="py-4 md:px-4">
//                           <button
//                             onClick={() => removeItemFromCart(item.itemId)}
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-gray-500">Your cart is empty.</p>
//             )}
//           </div>
//           <button
//             onClick={() => router.push("/all-products")}
//             className="group flex items-center mt-6 gap-2 text-orange-600"
//           >
//             <Image
//               className="group-hover:-translate-x-1 transition"
//               src={assets.arrow_right_icon_colored}
//               alt="arrow_right_icon_colored"
//             />
//             Continue Shopping
//           </button>
//         </div>
//         <OrderSummary />
//       </div>
//       <div></div>
//     </>
//   );
// };

// export default sampleCart;

// CHECKOUT FORM COMPONENT
//Billing Information
{
  /* <Card
                className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group"
                style={{ animationDelay: "200ms" }}
              >
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-n-lumira_coral/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-n-lumira_coral/5 via-transparent to-n-primary/5 relative">
                  <div className="p-3 rounded-xl bg-n-lumira_coral/20 group-hover:bg-n-lumira_coral/30 transition-colors duration-300">
                    <User className="h-6 w-6 text-n-lumira_coral" />
                  </div>
                  <CardTitle className="text-n-foreground text-2xl font-bold">
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onCheckedChange={setSameAsShipping}
                      className="data-[state=checked]:bg-n-primary data-[state=checked]:border-n-primary"
                    />
                    <Label
                      htmlFor="sameAsShipping"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Same as shipping address
                    </Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingFirstName"
                            className="text-sm font-medium"
                          >
                            First Name
                          </Label>
                          <Input
                            id="billingFirstName"
                            placeholder="John"
                            className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingLastName"
                            className="text-sm font-medium"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="billingLastName"
                            placeholder="Doe"
                            className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="billingAddress"
                          className="text-sm font-medium"
                        >
                          Address
                        </Label>
                        <Input
                          id="billingAddress"
                          placeholder="123 Main Street"
                          className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingCity"
                            className="text-sm font-medium"
                          >
                            City
                          </Label>
                          <Input
                            id="billingCity"
                            placeholder="New York"
                            className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingState"
                            className="text-sm font-medium"
                          >
                            State
                          </Label>
                          <Select>
                            <SelectTrigger className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                              <SelectItem value="fl">Florida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="billingZipCode"
                            className="text-sm font-medium"
                          >
                            ZIP Code
                          </Label>
                          <Input
                            id="billingZipCode"
                            placeholder="10001"
                            className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card> */
}

//Functions for shipment addinf form

// const [orderItems] = useState([
//   {
//     id: "1",
//     name: "Modern Pendant Lamp",
//     price: 189,
//     image: "/src/assets/pendant-lamp.jpg",
//     quantity: 1,
//     color: "Brass",
//   },
//   {
//     id: "2",
//     name: "Study Desk Lamp",
//     price: 129,
//     image: "/src/assets/study-lamp.jpg",
//     quantity: 2,
//     color: "Black",
//   },
// ]);
// const subtotal = orderItems.reduce(
//   (sum, item) => sum + item.price * item.quantity,
//   0
// );
// const shipping = subtotal > 200 ? 0 : 15;
// const tax = subtotal * 0.08;
// const total = subtotal + shipping + tax;
//const { router, products, cartItems, localCart, userData } = useAppContext();
//const { user, isSignedIn } = useUser();

// const allCountries = Country.getAllCountries();
// const [queryCountry, setQueryCountry] = useState("");
// const [queryState, setQueryState] = useState("");
// const [queryCity, setQueryCity] = useState("");

// const [selectedCountry, setSelectedCountry] = useState(null);
// const [selectedState, setSelectedState] = useState(null);
// const [selectedCity, setSelectedCity] = useState("");
// const [area, setArea] = useState("");

// const [filteredCountries, setFilteredCountries] = useState(allCountries);
// const [filteredStates, setFilteredStates] = useState([]);
// const [filteredCities, setFilteredCities] = useState([]);

// const [countryName, setCountryName] = useState("");
// const [stateName, setStateName] = useState("");
// const [cityName, setCityName] = useState("");

// useEffect(() => {
//   if (selectedCountry) {
//     setCountryName(selectedCountry.name);
//     if (selectedState) {
//       setStateName(selectedState.name);
//     } else {
//       setStateName("");
//     }
//     if (selectedCity) {
//       setCityName(selectedCity);
//     } else {
//       setCityName("");
//     }
//   }
// }, [selectedCountry, selectedState, selectedCity]);
// const countryRef = useRef(null);
// const stateRef = useRef(null);
// const cityRef = useRef(null);

// // Hide dropdowns on outside click
// useEffect(() => {
//   const handleClickOutside = (e) => {
//     if (!countryRef.current?.contains(e.target)) setDropdownCountry(false);
//     if (!stateRef.current?.contains(e.target)) setDropdownState(false);
//     if (!cityRef.current?.contains(e.target)) setDropdownCity(false);
//   };

//   const handleEscape = (e) => {
//     if (e.key === "Escape") {
//       setDropdownCountry(false);
//       setDropdownState(false);
//       setDropdownCity(false);
//     }
//   };

//   document.addEventListener("mousedown", handleClickOutside);
//   document.addEventListener("keydown", handleEscape);
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//     document.removeEventListener("keydown", handleEscape);
//   };
// }, []);

// const [dropdownCountry, setDropdownCountry] = useState(false);
// const [dropdownState, setDropdownState] = useState(false);
// const [dropdownCity, setDropdownCity] = useState(false);

// const handleCountryInput = (e) => {
//   const input = e.target.value;
//   setQueryCountry(input);
//   const filtered = allCountries.filter((country) =>
//     country.name.toLowerCase().startsWith(input.toLowerCase())
//   );
//   setFilteredCountries(filtered);
//   setDropdownCountry(true);
// };

// const handleStateInput = (e) => {
//   const input = e.target.value;
//   setQueryState(input);
//   if (selectedCountry) {
//     const states = State.getStatesOfCountry(selectedCountry.isoCode);
//     const filtered = states.filter((state) =>
//       state.name.toLowerCase().startsWith(input.toLowerCase())
//     );
//     setFilteredStates(filtered);
//     setDropdownState(true);
//   }
// };

// const handleCityInput = (e) => {
//   const input = e.target.value;
//   setQueryCity(input);
//   if (selectedCountry && selectedState) {
//     const cities = City.getCitiesOfState(
//       selectedCountry.isoCode,
//       selectedState.isoCode
//     );
//     const filtered = cities.filter((city) =>
//       city.name.toLowerCase().startsWith(input.toLowerCase())
//     );
//     setFilteredCities(filtered);
//     setDropdownCity(true);
//   }
// };

// const handleSelectCountry = (country) => {
//   setSelectedCountry(country);
//   setQueryCountry(country.name);
//   setFilteredStates(State.getStatesOfCountry(country.isoCode));
//   setSelectedState(null);
//   setSelectedCity("");
//   setFilteredCities([]);
//   setDropdownCountry(false);
// };

// const handleSelectState = (state) => {
//   setSelectedState(state);
//   setQueryState(state.name);
//   setFilteredCities(
//     City.getCitiesOfState(selectedCountry.isoCode, state.isoCode)
//   );
//   setSelectedCity("");
//   setDropdownState(false);
// };

// const handleSelectCity = (city) => {
//   setSelectedCity(city.name);
//   setQueryCity(city.name);
//   setDropdownCity(false);
// };

// console.log("Selected Country:", selectedCountry);
// console.log("Selected Country Name:", countryName);
// console.log("Selected State:", selectedState);
// console.log("Selected State Name:", stateName);
// console.log("Selected City:", selectedCity);
// console.log("Selected City Name:", cityName);

// useEffect(() => {
//   setUserInfo((prev) => ({
//     ...prev,
//     Country: countryName,
//     State: stateName,
//     City: cityName,
//   }));
// }, [countryName, stateName, cityName]);

// const [getUserInfo, setUserInfo] = useState({
//   FirstName: "",
//   LastName: "",
//   Email: "",
//   Phone: "",
//   FullAddress: "",
//   Country: "",
//   State: "",
//   City: "",
//   ZipCode: "",
// });

// console.log("User Info from checkout component:", getUserInfo);
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   await AddShippingInfo(user, isSignedIn, getUserInfo)();
// };

//Payment method card input form
// <Card
//   className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group"
//   style={{ animationDelay: "400ms" }}
// >
//   {/* Card decoration */}
//   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>
//   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-n-lumira_salmon/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//   <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-n-lumira_salmon/5 via-transparent to-n-primary/5 relative">
//     <div className="p-3 rounded-xl bg-n-lumira_salmon/20 group-hover:bg-n-lumira_salmon/30 transition-colors duration-300">
//       <CreditCard className="h-6 w-6 text-n-lumira_salmon" />
//     </div>
//     <CardTitle className="text-n-foreground text-2xl font-bold">
//       Payment Information
//     </CardTitle>
//   </CardHeader>
//   <CardContent className="space-y-6 p-8">
//     <div className="space-y-2">
//       <Label htmlFor="cardNumber" className="text-sm font-medium">
//         Card Number
//       </Label>
//       <Input
//         id="cardNumber"
//         placeholder="1234 5678 9012 3456"
//         className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300 font-mono"
//       />
//     </div>
//     <div className="grid grid-cols-2 gap-4">
//       <div className="space-y-2">
//         <Label htmlFor="expiryDate" className="text-sm font-medium">
//           Expiry Date
//         </Label>
//         <Input
//           id="expiryDate"
//           placeholder="MM/YY"
//           className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300 font-mono"
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="cvv" className="text-sm font-medium">
//           CVV
//         </Label>
//         <Input
//           id="cvv"
//           placeholder="123"
//           className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300 font-mono"
//         />
//       </div>
//     </div>
//     <div className="space-y-2">
//       <Label htmlFor="cardName" className="text-sm font-medium">
//         Name on Card
//       </Label>
//       <Input
//         id="cardName"
//         placeholder="John Doe"
//         className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
//       />
//     </div>
//   </CardContent>
// </Card>
