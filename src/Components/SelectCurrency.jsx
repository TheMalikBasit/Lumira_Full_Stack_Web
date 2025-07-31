// SelectCurrency.jsx
import React, { useEffect, useState, useRef } from "react";
import { X, Globe, Check } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { useAppContext } from "@/Context/AppContext";
import CurrencyList from "currency-list";
import { Country, State, City } from "country-state-city";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { LottieLoading } from "./Loading";
const SelectCurrency = () => {
  const allCountries = Country.getAllCountries();
  const [queryCountry, setQueryCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(allCountries);
  const countryRef = useRef(null);
  const [dropdownCountry, setDropdownCountry] = useState(false);
  const [tempCurrency, setTempCurrency] = useState("");
  console.log("Country Data: ", selectedCountry);
  console.log("Country Currency Data: ", tempCurrency);

  const handleCurrency = CurrencyList.get(tempCurrency);
  console.log("Currency List Data: ", handleCurrency);
  const handleCountryInput = (e) => {
    const input = e.target.value;
    setQueryCountry(input);
    const filtered = allCountries.filter((country) =>
      country.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredCountries(filtered);
    setDropdownCountry(true);
  };
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setQueryCountry(country.name);
    setTempCurrency(country.currency);
    setDropdownCountry(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!countryRef.current?.contains(e.target)) setDropdownCountry(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownCountry(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { code: "PKR", name: "Pakistan Ruppee", symbol: "RS", flag: "🇵🇰" },
    // { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
    // { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  ];
  const { Currency, loading } = useAppContext();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isOpen, setIsOpen] = useState(true);
  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  useEffect(() => {
    setSelectedCurrency(Currency);
  }, [Currency]);

  const handleConfirm = () => {
    localStorage.setItem("selectedCurrency", selectedCurrency);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (isOpen === false) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        // onClick={() => setIsOpen(false)}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-n-primary/20 rounded-full animate-pulse"
            // style={{
            //   left: `${Math.random() * 100}%`,
            //   top: `${Math.random() * 100}%`,
            //   animationDelay: `${Math.random() * 2}s`,
            //   animationDuration: `${2 + Math.random() * 2}s`,
            // }}
          />
        ))}
      </div>

      {/* Modal Content */}
      <div className="relative bg-n-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-n-border/20 p-8 max-w-md w-full mx-4 animate-scale-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-n-muted/50 hover:bg-n-muted text-n-muted_foreground hover:text-n-foreground transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-n-primary/10 rounded-full">
              <Globe className="h-8 w-8 text-n-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-n-foreground mb-2">
            Select Your Currency
          </h2>
          <p className="text-n-muted_foreground text-sm">
            Choose your preferred currency for the best shopping experience
          </p>
        </div>

        {/* Currency Grid */}
        {loading ? (
          <>
            <div className="min-h-[20rem] py-8">
              <LottieLoading />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                ${
                  selectedCurrency === currency.code
                    ? "border-n-primary bg-n-primary/5 shadow-lg"
                    : "border-n-border bg-n-card hover:border-n-primary/30 hover:bg-n-primary/5"
                }
              `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-n-foreground text-sm">
                        {currency.code}
                      </div>
                      <div className="text-xs text-n-muted_foreground">
                        {currency.symbol}
                      </div>
                    </div>
                    {selectedCurrency === currency.code && (
                      <Check className="h-4 w-4 text-n-primary" />
                    )}
                  </div>
                </button>
              ))}

              {/* Custom Currency */}
            </div>
            <div ref={countryRef} className="relative mb-4">
              {/* <Label className="text-sm font-medium">Country</Label> */}
              <div className="relative p-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 border-n-border bg-n-card hover:border-n-primary/30 hover:bg-n-primary/5 focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary">
                <Input
                  type="text"
                  placeholder={queryCountry ? queryCountry : "Select country"}
                  value={queryCountry}
                  onChange={handleCountryInput}
                  onFocus={() => setDropdownCountry(true)}
                  className="border-none focus:border-n-foreground"
                />
              </div>
              {dropdownCountry && (
                <ul className="absolute bottom-full rounded-lg z-10 w-full max-h-60 overflow-auto ring-2 ring-n-primary/20 border-n-primary transition-all duration-300 bg-white border shadow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
          </>
        )}

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          className="w-full bg-n-primary hover:bg-n-primary/90 text-n-primary_foreground font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
        >
          Confirm Currency Selection
        </Button>
      </div>
    </div>
  );
};

export default SelectCurrency;
