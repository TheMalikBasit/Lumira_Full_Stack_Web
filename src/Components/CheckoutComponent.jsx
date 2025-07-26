"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { AddShippingInfo } from "../../models/AddrerssHandler";
import { ArrowLeft, CreditCard, Lock, MapPin, User } from "lucide-react";
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
const Checkout = () => {
  const [orderItems] = useState([
    {
      id: "1",
      name: "Modern Pendant Lamp",
      price: 189,
      image: "/src/assets/pendant-lamp.jpg",
      quantity: 1,
      color: "Brass",
    },
    {
      id: "2",
      name: "Study Desk Lamp",
      price: 129,
      image: "/src/assets/study-lamp.jpg",
      quantity: 2,
      color: "Black",
    },
  ]);
  const { router, products, cartItems, localCart } = useAppContext();
  const { user, isSignedIn } = useUser();

  const allCountries = Country.getAllCountries();
  const [queryCountry, setQueryCountry] = useState("");
  const [queryState, setQueryState] = useState("");
  const [queryCity, setQueryCity] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [area, setArea] = useState("");

  const [filteredCountries, setFilteredCountries] = useState(allCountries);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    if (selectedCountry) {
      setCountryName(selectedCountry.name);
      if (selectedState) {
        setStateName(selectedState.name);
      } else {
        setStateName("");
      }
      if (selectedCity) {
        setCityName(selectedCity);
      } else {
        setCityName("");
      }
    }
  }, [selectedCountry, selectedState, selectedCity]);
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  // Hide dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!countryRef.current?.contains(e.target)) setDropdownCountry(false);
      if (!stateRef.current?.contains(e.target)) setDropdownState(false);
      if (!cityRef.current?.contains(e.target)) setDropdownCity(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownCountry(false);
        setDropdownState(false);
        setDropdownCity(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const [dropdownCountry, setDropdownCountry] = useState(false);
  const [dropdownState, setDropdownState] = useState(false);
  const [dropdownCity, setDropdownCity] = useState(false);

  const handleCountryInput = (e) => {
    const input = e.target.value;
    setQueryCountry(input);
    const filtered = allCountries.filter((country) =>
      country.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredCountries(filtered);
    setDropdownCountry(true);
  };

  const handleStateInput = (e) => {
    const input = e.target.value;
    setQueryState(input);
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.isoCode);
      const filtered = states.filter((state) =>
        state.name.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredStates(filtered);
      setDropdownState(true);
    }
  };

  const handleCityInput = (e) => {
    const input = e.target.value;
    setQueryCity(input);
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      );
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredCities(filtered);
      setDropdownCity(true);
    }
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setQueryCountry(country.name);
    setFilteredStates(State.getStatesOfCountry(country.isoCode));
    setSelectedState(null);
    setSelectedCity("");
    setFilteredCities([]);
    setDropdownCountry(false);
  };

  const handleSelectState = (state) => {
    setSelectedState(state);
    setQueryState(state.name);
    setFilteredCities(
      City.getCitiesOfState(selectedCountry.isoCode, state.isoCode)
    );
    setSelectedCity("");
    setDropdownState(false);
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city.name);
    setQueryCity(city.name);
    setDropdownCity(false);
  };
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  console.log("Selected Country:", selectedCountry);
  console.log("Selected Country Name:", countryName);
  console.log("Selected State:", selectedState);
  console.log("Selected State Name:", stateName);
  console.log("Selected City:", selectedCity);
  console.log("Selected City Name:", cityName);

  useEffect(() => {
    setUserInfo((prev) => ({
      ...prev,
      Country: countryName,
      State: stateName,
      City: cityName,
    }));
  }, [countryName, stateName, cityName]);

  const [getUserInfo, setUserInfo] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    FullAddress: "",
    Country: "",
    State: "",
    City: "",
    ZipCode: "",
  });

  console.log("User Info from checkout component:", getUserInfo);
  const handleSubmit = async (e) => {
    e.preventDefault();

    await AddShippingInfo(user, isSignedIn, getUserInfo)();
  };

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
              {/* Shipping Information */}
              <Card className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group">
                {/* Card decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-n-primary/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-n-primary/5 via-transparent to-n-lumira_coral/5 relative">
                  <div className="p-3 rounded-xl bg-n-primary/20 group-hover:bg-n-primary/30 transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-n-primary" />
                  </div>
                  <CardTitle className="text-n-foreground text-2xl font-bold">
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={getUserInfo.FirstName}
                          onChange={(e) =>
                            setUserInfo({
                              ...getUserInfo,
                              FirstName: e.target.value,
                            })
                          }
                          className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={getUserInfo.LastName}
                          onChange={(e) =>
                            setUserInfo({
                              ...getUserInfo,
                              LastName: e.target.value,
                            })
                          }
                          className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={getUserInfo.Email}
                        onChange={(e) =>
                          setUserInfo({ ...getUserInfo, Email: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={getUserInfo.Phone}
                        onChange={(e) =>
                          setUserInfo({ ...getUserInfo, Phone: e.target.value })
                        }
                        className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 w-full">
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium"
                        >
                          Full Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={getUserInfo.FullAddress}
                          onChange={(e) =>
                            setUserInfo({
                              ...getUserInfo,
                              FullAddress: e.target.value,
                            })
                          }
                          className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2 min-w-5">
                        <Label className="text-sm font-medium">Zip Code</Label>

                        <Input
                          type="number"
                          required
                          placeholder="10001"
                          value={getUserInfo.ZipCode}
                          onChange={(e) =>
                            setUserInfo({
                              ...getUserInfo,
                              ZipCode: e.target.value,
                            })
                          }
                          className="no-spinner focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Country div     */}
                      <div ref={countryRef} className="relative space-y-2">
                        <Label className="text-sm font-medium">Country</Label>
                        <Input
                          type="text"
                          placeholder={
                            countryName ? countryName : "Select country"
                          }
                          value={queryCountry}
                          onChange={handleCountryInput}
                          onFocus={() => setDropdownCountry(true)}
                          className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                        />
                        {dropdownCountry && (
                          <ul className="absolute bottom-full z-10 w-full max-h-60 overflow-auto ring-2 ring-n-primary/20 border-n-primary transition-all duration-300 bg-white border rounded shadow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {filteredCountries.map((country) => (
                              <li
                                key={country.isoCode}
                                onClick={() => handleSelectCountry(country)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {country.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {/* State */}
                      <div ref={stateRef} className="relative space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">State</Label>
                          {!selectedCountry && (
                            <>
                              <span
                                data-tooltip-id="select-country-tooltip"
                                data-tooltip-content="Select a Country First"
                                className="cursor-help text-sm text-blue-500"
                              >
                                ?
                              </span>
                              <Tooltip id="select-country-tooltip" />
                            </>
                          )}
                        </div>
                        <Input
                          type="text"
                          placeholder="Select state"
                          value={queryState}
                          onChange={handleStateInput}
                          onFocus={
                            selectedCountry
                              ? () => setDropdownState(true)
                              : null
                          }
                          className={`${
                            selectedCountry ? "opacity-100" : "opacity-50"
                          } focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300`}
                          disabled={!selectedCountry}
                        />
                        {dropdownState && (
                          <ul className="absolute bottom-full z-10 w-full max-h-60 overflow-auto ring-2 ring-n-primary/20 border-n-primary transition-all duration-300 bg-white border rounded shadow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {filteredStates.map((state) => (
                              <li
                                key={state.isoCode}
                                onClick={() => handleSelectState(state)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {state.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {/* City */}

                      <div ref={cityRef} className="relative space-y-2">
                        <Label className="text-sm font-medium">City</Label>
                        {!selectedState && (
                          <>
                            <span
                              data-tooltip-id="select-state-tooltip"
                              data-tooltip-content="Select a State First"
                              className="cursor-help text-sm text-blue-500"
                            >
                              ?
                            </span>
                            <Tooltip id="select-state-tooltip" />
                          </>
                        )}

                        <Input
                          type="text"
                          placeholder="Select city"
                          value={queryCity}
                          onChange={handleCityInput}
                          onFocus={() => setDropdownCity(true)}
                          className={`${
                            selectedState ? "opacity-100" : "opacity-50"
                          } focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300`}
                          disabled={!selectedState}
                        />
                        {dropdownCity && (
                          <ul className="absolute bottom-full z-10 w-full max-h-60 overflow-auto ring-2 ring-n-primary/20 border-n-primary transition-all duration-300 bg-white border rounded shadow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {filteredCities.map((city) => (
                              <li
                                key={city.name}
                                onClick={() => handleSelectCity(city)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {city.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <Button className={"text-center w-full mt-3"}>
                      Add Shipment Infomation
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {/* Payment Information */}
              <Payment />
            </div>

            {/* Order Summary */}
            <CheckOutSummary />
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
