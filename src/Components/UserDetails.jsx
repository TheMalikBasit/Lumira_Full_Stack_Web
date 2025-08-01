"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../Config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAppContext } from "@/Context/AppContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import AddAddressComponent from "./AddAddressComponent";

const UserDetails = ({ openAddAddress }) => {
  const { userData, darkMode } = useAppContext();
  const { user, isSignedIn } = useUser();
  const [Address, setAddress] = useState();
  const [checked, setchecked] = useState(false);
  const [addressIndex, setaddressIndex] = useState();
  //console.log("user data from app context", userData.address);
  //console.log("user data from clerk", user);

  const dropdownHandler = () => {
    if (checked) {
      setchecked(false);
    } else {
      setchecked(true);
    }
  };

  const allAddress = userData.address;
  //   <div>
  //   {Array.isArray(allAddress) &&
  //     allAddress.map((item, idx) => (
  //       <div key={idx}>{item}</div>
  //     ))}
  // </div>
  return (
    <div
      className={`border p-5 mb-5 ${
        darkMode ? "border-white" : "border-black"
      }`}
    >
      {/* <div>
        {Array.isArray(allAddress) &&
          allAddress.map((item, idx) => <div key={idx}>{item.City}</div>)}
      </div> */}

      <div
        className={`border p-5 mb-5 ${
          darkMode ? "border-white" : "border-black"
        }`}
      >
        <div className={`flex flex-row items-center`}>
          <div className="w-full border border-n-11 mr-8 p-2">
            <div className="text-black">
              {/* {Array.isArray(allAddress) &&
                allAddress.map((item, idx) => (
                  <div className="text-black" key={idx}>
                    {item.City}
                  </div>
                ))} */}
              <h1 className="text-black">
                {Array.isArray(allAddress) && allAddress[0].City}
              </h1>
            </div>
          </div>
          <button
            onClick={openAddAddress}
            className="text-end text-2xl md:text-4xl"
          >
            <FontAwesomeIcon
              icon={checked ? faCheckSquare : faSquare}
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
