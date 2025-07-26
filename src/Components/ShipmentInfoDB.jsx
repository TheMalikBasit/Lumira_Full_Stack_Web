import React from "react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { AddShippingInfo } from "../../models/AddrerssHandler";
import { ArrowLeft, CreditCard, Lock, MapPin, User } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";

const ShipmentInfoDB = ({ data }) => {
  console.log("User Shipment data", data);
  return (
    <Card className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group">
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
        {data.map((item, index) => (
          <div key={index}>{item.FirstName}</div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ShipmentInfoDB;
