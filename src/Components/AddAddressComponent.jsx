"use client";
import { AddAddress } from "../../models/AddrerssHandler";
import { useState } from "react";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import Button from "./Button";
import { useUser } from "@clerk/nextjs";
const AddAddressComponent = ({ onClose }) => {
  const [address, setaddress] = useState({
    Country: "",
    State: "",
    City: "",
    Area: "",
    House: "",
    Hints: "",
  });

  const { user, isSignedIn } = useUser();
  // const [Country, setCountry] = useState("");
  // const [State, setState] = useState("");
  // const [City, setCity] = useState("");
  // const [Area, setArea] = useState("");
  // const [House, setHouse] = useState("");
  // const [Hints, setHints] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await AddAddress(user, isSignedIn, address)();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Video as background */}
        <video
          src="/GradientVideo.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ pointerEvents: "none" }}
        />
        {/* Content on top of video */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center backdrop-blur-lg bg-opacity-80 rounded shadow-lg p-8">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-3xl font-bold"
          >
            ×
          </button>
          <div className="max-w-2xl lg:min-w-[30%]">
            <h2 className="text-center mb-10 font-bold text-lg md:text-2xl font-ubuntu text-black">
              Add A New Address
            </h2>
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-xl shadow-lg border border-n-8 space-y-5"
            >
              <div>
                <label className="font-bold text-lg font-ubuntu">Country</label>
                <input
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={address.Country}
                  onChange={(e) =>
                    setaddress({ ...address, Country: e.target.value })
                  }
                  placeholder="Enter your country"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-md font-ubuntu">State</label>
                <input
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={address.State}
                  onChange={(e) =>
                    setaddress({ ...address, State: e.target.value })
                  }
                  placeholder="Enter your state"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-md font-ubuntu">City</label>
                <input
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={address.City}
                  onChange={(e) =>
                    setaddress({ ...address, City: e.target.value })
                  }
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-md font-ubuntu">Area</label>

                <input
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={address.Area}
                  onChange={(e) =>
                    setaddress({ ...address, Area: e.target.value })
                  }
                  placeholder="Enter your area name"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-md font-ubuntu">
                  House Number
                </label>
                <input
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={address.House}
                  onChange={(e) =>
                    setaddress({ ...address, House: e.target.value })
                  }
                  placeholder="Enter your House Number/Name"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-md font-ubuntu">Hints</label>
                <textarea
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={address.Hints}
                  onChange={(e) =>
                    setaddress({ ...address, Hints: e.target.value })
                  }
                  placeholder="Enter address hints e.g popular land marks etc"
                  rows={2}
                ></textarea>
              </div>
              <Button white className="mt-5 xl:mt-0 w-full" type="submit">
                Add Address
              </Button>
              <ButtonGradient />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddressComponent;
