export const fetchOrders = async () => {
  const response = await fetch("http://localhost:4000/api/orders");
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
};
