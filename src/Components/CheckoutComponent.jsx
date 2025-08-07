"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { AddShippingInfo } from "../../models/AddrerssHandler";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  User,
  PlusCircleIcon,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import {
  Select,
  SelectContent,
  SelectDropDown,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select";
import { Separator } from "@/Components/UI/separator";
import { Checkbox } from "@/Components/UI/checkbox";
import Navbar from "./Navbar";
import { useAppContext } from "@/Context/AppContext";
import Payment from "./Payment";
import CheckOutSummary from "./CheckOutSummary";
import { Country, State, City } from "country-state-city";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ShipmentInfoDB from "./ShipmentInfoDB";
import ShipmentForm from "./ShipmentForm";
import { LottieLoading } from "./Loading";
import toast from "react-hot-toast";
const Checkout = () => {
  const { router, products, cartItems, localCart, userData, loading } =
    useAppContext();
  const { user, isSignedIn } = useUser();
  const [shipmentData, setShipmentData] = useState([]);
  const [toggleNewAddress, setToggleNewAddress] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedShippingData, setSelectedShippingData] = useState({});
  const [Subtotal, setSubtotal] = useState(null);
  const [shipmentCharges, setShipmentCharges] = useState(null);
  const [paymentOption, setpaymentOption] = useState("");
  const [transactionId, setTransactionId] = useState("");

  //Summarized info that will be used for checkout
  const [AllComponentInfo, setAllComponentInfo] = useState({
    shippingInfo: selectedShippingData,
  });

  const handleAddressSelection = (index) => {
    const selectedAddress = shipmentData.at(index);
    if (index === null) {
      setSelectedShippingData({});
    } else {
      setSelectedShippingData(selectedAddress);
    }
    //console.log("Handle Address Selection is called");
  };

  const handlePaymentSelection = (Method) => {
    if (Method != "") {
      if (Method === "cod" && selectedShippingData.Country != "Pakistan") {
        setpaymentOption("");
      } else {
        setpaymentOption(Method);
      }
    } else {
      setpaymentOption("");
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleToggle = () => {
    setToggleNewAddress(!toggleNewAddress);
  };

  const handleTotal = (total) => {
    setSubtotal(total);
  };

  useEffect(() => {
    if (userData && Array.isArray(userData.ShippingInfo)) {
      setShipmentData(userData.ShippingInfo);
      setToggleNewAddress(true);
    }
  }, [userData]);

  useEffect(() => {
    if (selectedShippingData) {
      const country = selectedShippingData.Country;
      const city = selectedShippingData.City;

      if (!country) {
        setShipmentCharges(null);
      } else if (country === "Pakistan") {
        if (city === "Lahore") {
          setShipmentCharges(5);
        } else {
          setShipmentCharges(12);
        }
      } else {
        setShipmentCharges(20);
      }
    }
  }, [selectedShippingData]);

  useEffect(() => {
    if (!user) {
      toast.error("Login to complete your order");
    }
  }, [isSignedIn]);

  console.log("payment method", paymentOption);
  return (
    <>
      <Navbar relative />
      <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-n-primary/25 via-n-lumira_coral/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-n-lumira_coral/25 via-n-lumira_salmon/15 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-n-primary/3 via-transparent to-n-lumira_coral/3 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Floating particles */}
          <div
            className="absolute top-20 left-20 w-2 h-2 bg-n-primary/30 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-40 right-32 w-1 h-1 bg-n-lumira_coral/50 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-n-lumira_salmon/40 rounded-full animate-pulse"
            style={{ animationDelay: "2.5s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex items-center gap-6 mb-16">
            <div onClick={() => router.back()} className="cursor-pointer">
              <Button
                variant="ghost"
                size="icon"
                className="hover-scale shadow-warm hover:shadow-glow transition-all duration-300 bg-n-card/50 backdrop-blur-sm border border-n-border/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1">
              <h1 className="text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-3 animate-fade-in">
                Secure Checkout
              </h1>
              {/* <p
                className="text-n-muted_foreground text-lg animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                Complete your order with confidence
              </p> */}
            </div>
            <div
              className="hidden md:flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-right">
                <p className="text-sm text-n-muted_foreground">
                  Secure Payment
                </p>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-500" />
                  <p className="text-lg font-bold text-emerald-600">
                    Protected
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Checkout Form */}
            <div className="space-y-8">
              <div key={reloadKey}>
                {/* user shipment Information */}
                {shipmentData && (
                  <div className="mb-4">
                    <ShipmentInfoDB
                      data={shipmentData}
                      selectedAddress={handleAddressSelection}
                      onReload={handleReload}
                    />
                  </div>
                )}
                {/* Shipping Information */}
                {toggleNewAddress == true ? (
                  <>
                    <div onClick={handleToggle} className="cursor-pointer">
                      <Card className=" border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group">
                        {/* Card decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-lumira_coral via-n-primary to-n-lumira_salmon"></div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-n-lumira_coral/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-n-lumira_coral/5 via-transparent to-n-primary/5 relative">
                          <div className="p-3 rounded-xl bg-n-lumira_coral/20 group-hover:bg-n-lumira_coral/30 transition-colors duration-300">
                            <PlusCircleIcon className="h-6 w-6 text-n-lumira_coral" />
                          </div>
                          <CardTitle className="text-n-foreground text-2xl font-bold">
                            Add A new Address
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  </>
                ) : (
                  <ShipmentForm
                    onReload={handleReload}
                    handleToggle={handleToggle}
                  />
                )}
              </div>

              {/* Payment Information */}
              <Payment
                paymentSelection={handlePaymentSelection}
                CountryData={selectedShippingData.Country}
                setTransactionId={setTransactionId}
              />
            </div>

            {/* Order Summary */}
            <CheckOutSummary
              shipmentCharge={shipmentCharges}
              totalCharged={handleTotal}
              selectedShippingData={selectedShippingData}
              selectedPaymentData={paymentOption}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
