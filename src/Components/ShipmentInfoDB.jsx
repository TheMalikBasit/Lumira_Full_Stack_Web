import React from "react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  AddShippingInfo,
  deleteShipmentInfoByIndex,
} from "../../models/AddrerssHandler";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  User,
  Trash2,
} from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { Checkbox } from "@/Components/UI/checkbox";
import { LottieLoading } from "./Loading";
import { useAppContext } from "@/Context/AppContext";
const ShipmentInfoDB = ({ data, selectedAddress, onReload }) => {
  const { loading, setUserData } = useAppContext();
  const { user } = useUser();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleSelect = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    }
    if (selectedIndex != index) {
      setSelectedIndex(index);
    } else {
      setSelectedIndex(null);
    }
  };

  const handleDelete = async (index) => {
    await deleteShipmentInfoByIndex(user, index, setUserData);
    onReload(); // run this after deletion completes
  };

  useEffect(() => {
    selectedAddress(selectedIndex);
  }, [selectedIndex]);

  return (
    <Card className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group">
      {/* Card decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-lumira_coral via-n-primary to-n-lumira_salmon"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-n-lumira_coral/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-n-lumira_coral/5 via-transparent to-n-primary/5 relative">
        <div className="p-3 rounded-xl bg-n-lumira_coral/20 group-hover:bg-n-lumira_coral/30 transition-colors duration-300">
          <MapPin className="h-6 w-6 text-n-lumira_coral" />
        </div>
        <CardTitle className="text-n-foreground text-2xl font-bold">
          Saved Addresses
        </CardTitle>
      </CardHeader>
      {loading ? (
        <div className="flex min-h-screen justify-center py-8">
          <LottieLoading />
        </div>
      ) : (
        <>
          <CardContent className="space-y-6 p-8">
            <p className="text-n-muted_foreground text-sm mb-6">
              Select a previously used address or add a new one below
            </p>
            <div className="space-y-4 max-h-[20rem] hover:overflow-y-auto and overflow-hidden scrollbar-thin scrollbar-thumb-n-muted_foreground scrollbar-track-transparent">
              {data.map((item, index) => {
                const checkboxId = `address-${index}`;
                const isChecked = selectedIndex === index;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl border border-n-border/30 hover:border-n-primary/30 bg-gradient-to-r from-n-card to-n-muted/20 hover:from-n-primary/5 hover:to-n-lumira_coral/5 transition-all duration-300 group/address cursor-pointer"
                    // whole div clickable
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={isChecked}
                      onCheckedChange={() => handleSelect(index)}
                      name="savedAddress"
                      className="mt-1 data-[state=checked]:bg-n-primary data-[state=checked]:border-n-primary"
                    />
                    <div
                      className="flex-1 space-y-1 cursor-pointer"
                      onClick={() => handleSelect(index)}
                    >
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={checkboxId}
                          className="font-medium text-n-foreground cursor-pointer"
                        >
                          Home Address
                        </Label>
                        {index == 0 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-n-primary/10 text-n-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-n-muted_foreground">
                        {item.FirstName} {item.LastName}
                      </p>
                      <p className="text-sm text-n-muted_foreground">
                        {item.FullAddress}
                      </p>
                      <p className="text-sm text-n-muted_foreground">
                        {item.State}, {item.City} {item.ZipCode}
                      </p>
                      <p className="text-sm text-n-muted_foreground">
                        {item.Phone}
                      </p>
                    </div>
                    <div
                      onClick={() => handleDelete(item.infoIndex)}
                      className="z-20 cursor-pointer ml-auto p-3 rounded-xl bg-n-primary/20 group-hover:bg-n-primary/30 transition-colors duration-300"
                    >
                      <Trash2 className="h-3 w-3 text-n-primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ShipmentInfoDB;
