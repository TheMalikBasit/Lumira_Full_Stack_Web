"use client";
import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, MapPin, User } from "lucide-react";
import { Button } from "@/Components/UI/lumiraButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import {
  Select,
  SelectContent,
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
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
                        className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
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
                      className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
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
                      <Label htmlFor="zipCode" className="text-sm font-medium">
                        ZIP Code
                      </Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        className="focus:ring-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              {/* <Card
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
              </Card> */}

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
