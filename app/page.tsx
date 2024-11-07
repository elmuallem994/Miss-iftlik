"use client";

import { useState } from "react";
import Categories from "./components/Categories";
import Featured from "./components/Featured";
import Offer from "./components/Offer";
import Slider from "./components/Slider";
import OrderStatusBar from "@/components/OrderStatusBar";

export default function Home() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  return (
    <main className="specific-section">
      <Slider />
      <Categories />
      <Featured />
      <Offer />
      {orderStatus && orderId && (
        <OrderStatusBar orderId={orderId} status={orderStatus} />
      )}
    </main>
  );
}
