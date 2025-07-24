"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { ArrowLeft, CreditCard, Lock, MapPin, User } from "lucide-react";
const Payment = () => {
  const [sameAsShipping, setSameAsShipping] = useState(true);
  return (
    <Card
      className="border-n-border/50 backdrop-blur-sm bg-n-card/80 hover:bg-n-card/90 hover:shadow-elegant transition-all duration-500 hover-lift animate-fade-in relative overflow-hidden group"
      style={{ animationDelay: "400ms" }}
    >
      {/* Card decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-n-primary via-n-lumira_coral to-n-lumira_salmon"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-n-lumira_salmon/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-n-lumira_salmon/5 via-transparent to-n-primary/5 relative">
        <div className="p-3 rounded-xl bg-n-lumira_salmon/20 group-hover:bg-n-lumira_salmon/30 transition-colors duration-300">
          <CreditCard className="h-6 w-6 text-n-lumira_salmon" />
        </div>
        <CardTitle className="text-n-foreground text-2xl font-bold">
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-sm font-medium">
            Card Number
          </Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300 font-mono"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-sm font-medium">
              Expiry Date
            </Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-sm font-medium">
              CVV
            </Label>
            <Input
              id="cvv"
              placeholder="123"
              className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300 font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardName" className="text-sm font-medium">
            Name on Card
          </Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Payment;
