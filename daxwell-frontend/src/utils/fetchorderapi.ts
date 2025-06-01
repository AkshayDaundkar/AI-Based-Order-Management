/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchOrders = async () => {
  const response = await fetch("http://localhost:4000/api/orders");
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
};

export const createOrder = async (order: any) => {
  const response = await fetch("http://localhost:4000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error("Failed to submit order");
  return await response.json();
};

export const deleteOrderAPI = async (orderNumber: string) => {
  const res = await fetch(`http://localhost:4000/api/orders/${orderNumber}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete order");
};

export const updateOrderAPI = async (
  orderNumber: string,
  updatedOrder: any
) => {
  const res = await fetch(`http://localhost:4000/api/orders/${orderNumber}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedOrder),
  });
  if (!res.ok) throw new Error("Failed to update order");
};
