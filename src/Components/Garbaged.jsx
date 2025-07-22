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
