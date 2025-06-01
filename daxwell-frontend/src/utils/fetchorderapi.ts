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
