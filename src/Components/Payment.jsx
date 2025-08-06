"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";
import { Checkbox } from "@/Components/UI/checkbox";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const Payment = ({ paymentSelection, CountryData, setTransactionId }) => {
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [CodChecked, setCodChecked] = useState(false);
  const [bankCheck, setBankCheck] = useState(Boolean);
  const [stripeCheck, setStripeCheck] = useState(Boolean);
  const [ID, setID] = useState("");

  const handleSelect = (option) => {
    if (PaymentMethod === "") {
      setPaymentMethod(option);
    }
    if (PaymentMethod != option) {
      setPaymentMethod(option);
    } else {
      setPaymentMethod("");
    }
  };

  useEffect(() => {
    if (PaymentMethod === "cod") {
      if (CountryData != "Pakistan") {
        setCodChecked(false);
        setBankCheck(false);
        setStripeCheck(false);
        setPaymentMethod("");
        paymentSelection("");
      } else {
        setCodChecked(true);
        setBankCheck(false);
        setStripeCheck(false);
        paymentSelection(PaymentMethod);
      }
    } else if (PaymentMethod === "bank") {
      setCodChecked(false);
      setBankCheck(true);
      setStripeCheck(false);
      paymentSelection(PaymentMethod);
    } else if (PaymentMethod === "stripe") {
      setStripeCheck(true);
      setCodChecked(false);
      setBankCheck(false);
      paymentSelection(PaymentMethod);
    } else {
      setCodChecked(false);
      setBankCheck(false);
      setStripeCheck(false);
      paymentSelection(PaymentMethod);
    }
  }, [PaymentMethod, CountryData]);

  useEffect(() => {
    setTransactionId(ID);
  }, [ID]);

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
          Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div className="space-y-4">
          {/* Cash on Delivery Option */}
          <div className="relative">
            {CountryData != "Pakistan" ? (
              CountryData == null ? (
                <>
                  <div
                    htmlFor="cod"
                    //onClick={() => handleSelect("cod")}
                    data-tooltip-id="payment-method-tooltip"
                    data-tooltip-content="Select An Address First"
                    className={`opacity-25 cursor-default flex items-start gap-4 p-6 rounded-xl border-2 border-n-border/50 bg-gradient-to-r from-n-muted/30 to-transparent transition-all duration-300 hover:border-n-primary/50 hover:bg-n-muted/50 group`}
                  >
                    {/* <div className="flex items-center justify-center w-5 h-5 mt-1">
                <div className="w-4 h-4 rounded-full border-2 border-n-muted_foreground group-hover:border-n-primary transition-colors duration-300 peer-checked:border-n-primary relative">
                  <div className="absolute inset-0.5 rounded-full bg-n-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div> */}
                    <Checkbox
                      //id="cod"
                      //checked={CodChecked}
                      //onCheckedChange={() => handleSelect("cod")}
                      //name="savedAddress"
                      className="mt-1 pointer-events-none"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300">
                          <svg
                            className="w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-n-foreground">
                          Cash on Delivery
                        </h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                          Popular
                        </span>
                      </div>
                      <p className="text-sm text-n-muted_foreground mb-2">
                        Pay in cash when your order arrives at your doorstep
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                          No processing fees
                        </span>
                        <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                          Available 24/7
                        </span>
                        <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                          Secure delivery
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tooltip id="payment-method-tooltip" />
                </>
              ) : (
                <>
                  <div
                    htmlFor="cod"
                    data-tooltip-id="payment-method-tooltip"
                    data-tooltip-content="Cash On Delivery is not available in your country"
                    //onClick={() => handleSelect("cod")}
                    className={`opacity-25 cursor-default flex items-start gap-4 p-6 rounded-xl border-2 border-n-border/50 bg-gradient-to-r from-n-muted/30 to-transparent transition-all duration-300 hover:border-n-primary/50 hover:bg-n-muted/50 group`}
                  >
                    {/* <div className="flex items-center justify-center w-5 h-5 mt-1">
                <div className="w-4 h-4 rounded-full border-2 border-n-muted_foreground group-hover:border-n-primary transition-colors duration-300 peer-checked:border-n-primary relative">
                  <div className="absolute inset-0.5 rounded-full bg-n-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div> */}
                    <Checkbox
                      //id="cod"
                      //checked={CodChecked}
                      //onCheckedChange={() => handleSelect("cod")}
                      //name="savedAddress"
                      className="mt-1 pointer-events-none"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300">
                          <svg
                            className="w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-n-foreground">
                          Cash on Delivery
                        </h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                          Popular
                        </span>
                      </div>
                      <p className="text-sm text-n-muted_foreground mb-2">
                        Pay in cash when your order arrives at your doorstep
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                          No processing fees
                        </span>
                        <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                          Available 24/7
                        </span>
                        <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                          Secure delivery
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tooltip id="payment-method-tooltip" />
                </>
              )
            ) : (
              <>
                <div
                  htmlFor="cod"
                  onClick={() => handleSelect("cod")}
                  className={`flex items-start gap-4 p-6 rounded-xl border-2 border-n-border/50 bg-gradient-to-r from-n-muted/30 to-transparent cursor-pointer transition-all duration-300 hover:border-n-primary/50 hover:bg-n-muted/50 ${
                    CodChecked
                      ? "border-n-primary bg-n-primary/5 shadow-elegant"
                      : ""
                  } group`}
                >
                  {/* <div className="flex items-center justify-center w-5 h-5 mt-1">
                <div className="w-4 h-4 rounded-full border-2 border-n-muted_foreground group-hover:border-n-primary transition-colors duration-300 peer-checked:border-n-primary relative">
                  <div className="absolute inset-0.5 rounded-full bg-n-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div> */}
                  <Checkbox
                    id="cod"
                    checked={CodChecked}
                    onCheckedChange={() => handleSelect("cod")}
                    name="savedAddress"
                    className="mt-1 data-[state=checked]:bg-n-primary data-[state=checked]:border-n-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-n-foreground">
                        Cash on Delivery
                      </h3>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                        Popular
                      </span>
                    </div>
                    <p className="text-sm text-n-muted_foreground mb-2">
                      Pay in cash when your order arrives at your doorstep
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                        No processing fees
                      </span>
                      <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                        Available 24/7
                      </span>
                      <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                        Secure delivery
                      </span>
                    </div>

                    <div
                      className={`transition-all duration-500 ease-smooth overflow-hidden ${
                        CodChecked
                          ? "max-h-40 opacity-100 py-2"
                          : "max-h-0 opacity-0 py-0"
                      }`}
                    >
                      <p className="text-sm text-n-muted_foreground">
                        It takes from 2-12 days to deliver orders. Keep checking
                        your order status after placing order.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bank Transfer Option */}
          <div className="relative">
            <div
              htmlFor="bank"
              onClick={() => handleSelect("bank")}
              className={`flex items-start gap-4 p-6 rounded-xl border-2 border-n-border/50 bg-gradient-to-r from-n-muted/30 to-transparent cursor-pointer transition-all duration-300 hover:border-n-primary/50 hover:bg-n-muted/50 ${
                bankCheck
                  ? "border-n-primary bg-n-primary/5 shadow-elegant"
                  : ""
              } group`}
            >
              {/* <div className="flex items-center justify-center w-5 h-5 mt-1">
                <div className="w-4 h-4 rounded-full border-2 border-n-muted_foreground group-hover:border-n-primary transition-colors duration-300 peer-checked:border-n-primary relative">
                  <div className="absolute inset-0.5 rounded-full bg-n-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div> */}
              <Checkbox
                id="bank"
                checked={bankCheck}
                onCheckedChange={() => handleSelect("bank")}
                name="savedAddress"
                className="mt-1 data-[state=checked]:bg-n-primary data-[state=checked]:border-n-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-n-foreground">
                    Bank Transfer
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                    Secure
                  </span>
                </div>
                <p className="text-sm text-n-muted_foreground mb-3">
                  Transfer funds directly from your bank account
                </p>
                <div
                  className={`transition-all duration-500 ease-smooth overflow-hidden ${
                    bankCheck
                      ? "opacity-100 py-2 max-h-[150px]"
                      : "opacity-0 py-0 max-h-0"
                  }`}
                >
                  <div className="bg-n-muted/50 rounded-lg p-4 mb-3 space-y-2">
                    <div className="text-xs font-semibold text-n-foreground">
                      Bank Details:
                    </div>
                    <div className="text-xs space-y-1 text-n-muted_foreground">
                      <div>
                        <span className="font-medium">Account Name:</span>{" "}
                        Lumira Lighting Ltd
                      </div>
                      <div>
                        <span className="font-medium">Account Number:</span>{" "}
                        1234567890
                      </div>
                      <div>
                        <span className="font-medium">Bank Name:</span> Meezan
                        Bank
                      </div>
                      {/* <div>
                      <span className="font-medium">Reference:</span> Your Order
                      ID
                    </div> */}
                    </div>
                  </div>
                </div>
                <div
                  className={`mb-3 w-full transition-all duration-500 ease-smooth overflow-hidden ${
                    bankCheck
                      ? "max-h-40 opacity-100 py-2"
                      : "max-h-0 opacity-0 py-0"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Label
                    htmlFor="transactionId"
                    className="text-sm font-medium"
                  >
                    Enter your transaction ID
                  </Label>
                  <div className="gap-1 flex flex-row">
                    <input
                      id="transactionId"
                      type="text"
                      placeholder="Transaction ID"
                      onChange={(e) => setID(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-n-input bg-n-background px-3 py-2 text-base ring-offset-n-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-n-foreground placeholder:text-n-muted_foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-2 mt-2 focus:ring-n-primary/20 focus:border-n-primary transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                    No transaction fees
                  </span>
                  <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                    2-3 business days
                  </span>
                  <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                    Bank-level security
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Transfer Option */}
          <div className="relative">
            <div
              htmlFor="stripe"
              onClick={() => handleSelect("stripe")}
              className={`flex items-start gap-4 p-6 rounded-xl border-2 border-n-border/50 bg-gradient-to-r from-n-muted/30 to-transparent cursor-pointer transition-all duration-300 hover:border-n-primary/50 hover:bg-n-muted/50 ${
                stripeCheck
                  ? "border-n-primary bg-n-primary/5 shadow-elegant"
                  : ""
              } group`}
            >
              {/* <div className="flex items-center justify-center w-5 h-5 mt-1">
                <div className="w-4 h-4 rounded-full border-2 border-n-muted_foreground group-hover:border-n-primary transition-colors duration-300 peer-checked:border-n-primary relative">
                  <div className="absolute inset-0.5 rounded-full bg-n-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div> */}

              <Checkbox
                id="stripe"
                checked={stripeCheck}
                onCheckedChange={() => handleSelect("stripe")}
                name="savedAddress"
                className="mt-1 data-[state=checked]:bg-n-primary data-[state=checked]:border-n-primary"
              />
              <div className="flex-1 justify-center md:justify-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-n-foreground">
                    Credit/Debit Card
                  </h3>
                  <span className="text-xs bg-n-lumira_coral/20 text-n-lumira_coral px-2 py-1 rounded-full font-semibold">
                    Instant
                  </span>
                </div>
                <p className="text-sm text-n-muted_foreground mb-3">
                  Pay securely with your credit or debit card via Stripe
                </p>
                <div
                  className={`transition-all duration-500 ease-smooth overflow-hidden ${
                    stripeCheck
                      ? "opacity-100 py-2 max-h-[150px]"
                      : "opacity-0 py-0 max-h-0"
                  }`}
                >
                  <div className="bg-gradient-to-r from-n-primary/5 to-n-lumira_coral/5 rounded-lg p-4 mb-3 border border-n-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-n-primary" />
                      <span className="text-sm font-semibold text-n-foreground">
                        Secure Stripe Payment
                      </span>
                    </div>
                    <p className="text-xs text-n-muted_foreground mb-2">
                      You'll be redirected to our secure Stripe checkout page to
                      complete your payment
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-n-muted_foreground">
                        Accepted cards:
                      </span>
                      <div className="flex gap-1">
                        <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          V
                        </div>
                        <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          M
                        </div>
                        <div className="w-6 h-4 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                          A
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                    Exchange fees
                  </span>
                  <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                    2-3 business days
                  </span>
                  <span className="bg-n-primary/10 text-n-primary px-2 py-1 rounded-full">
                    Bank-level security
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Payment;
