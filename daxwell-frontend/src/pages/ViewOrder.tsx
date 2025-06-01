// src/pages/ViewOrder.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Order } from "../types/order";
import { fetchOrders } from "../utils/fetchorderapi";

const ViewOrder = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrders();
        const found = data.find((o: Order) => o.orderNumber === orderNumber);
        if (!found) {
          console.warn("Order not found for:", orderNumber);
        }
        setOrder(found);
      } catch (e) {
        console.error("Failed to load order", e);
      }
    };
    load();
  }, [orderNumber]);

  if (!order)
    return (
      <div className="p-6">
        <p className="text-red-600">Order not found: {orderNumber}</p>
        <button
          className="mt-4 bg-gray-200 px-4 py-2 rounded"
          onClick={() => navigate("/orders/list")}
        >
          Back to List
        </button>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Order</h1>
      <button
        onClick={() => navigate("/orders/list")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back to Orders
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReadOnly label="Order Number" value={order.orderNumber} />
        <ReadOnly label="Customer" value={order.customer} />
        <ReadOnly label="Transaction Date" value={order.transactionDate} />
        <ReadOnly label="Status" value={order.status} />
        <ReadOnly label="From Location" value={order.fromLocation} />
        <ReadOnly label="To Location" value={order.toLocation} />
        <ReadOnly label="Support Rep" value={order.supportRep || ""} />
        <ReadOnly label="Incoterm" value={order.incoterm || ""} />
        <ReadOnly label="Freight Terms" value={order.freightTerms || ""} />
        <ReadOnly
          label="Total Ship Units"
          value={order.totalShipUnitCount || 0}
        />
        <ReadOnly label="Total Quantity" value={order.totalQuantity || 0} />
        <ReadOnly label="Discount Rate" value={order.discountRate || 0} />
        <ReadOnly
          label="Early Pickup Date"
          value={order.earlyPickupDate || ""}
        />
        <ReadOnly label="Late Pickup Date" value={order.latePickupDate || ""} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Pending Approval Reasons</h2>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {order.pendingApprovalReasonCode.map((code, idx) => (
            <li key={idx}>{code}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
        {Object.entries(order.billingAddress || {}).map(([k, v]) => (
          <ReadOnly key={k} label={k} value={v} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        {Object.entries(order.shippingAddress || {}).map(([k, v]) => (
          <ReadOnly key={k} label={k} value={v} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Order Lines</h2>
        {order.lines.map((line, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
            <ReadOnly label="Item" value={line.item} />
            <ReadOnly label="Units" value={line.units} />
            <ReadOnly label="Quantity" value={line.quantity} />
            <ReadOnly label="Price" value={line.price} />
            <ReadOnly label="Amount" value={line.amount.toFixed(2)} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ReadOnly = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <div className="bg-gray-100 px-3 py-2 rounded text-sm">{value}</div>
  </div>
);

export default ViewOrder;
