"use client";

import Loading from "@/Components/Loading";
import Navbar from "@/Components/Navbar";
import { useAppContext } from "@/Context/AppContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";
const page = () => {
  const { isAdmin, adminLoading } = useAppContext();

  if (adminLoading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return (
      <div>
        <Navbar relative />
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }
  if (isAdmin) {
    return (
      <div>
        <Navbar relative />
        Admin Page
      </div>
    );
  }
};

export default page;
