/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE_URL = "https://daxwell-assesment.onrender.com";

export const fetchOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
};

export const createOrder = async (order: any) => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error("Failed to submit order");
  return await response.json();
};

export const deleteOrderAPI = async (orderNumber: string) => {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderNumber}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete order");
};

export const updateOrderAPI = async (
  orderNumber: string,
  updatedOrder: any
) => {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderNumber}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedOrder),
  });
  if (!res.ok) throw new Error("Failed to update order");
};

export const fetchNotifications = async () => {
  const res = await fetch(`${API_BASE_URL}/api/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return await res.json(); // returns [{ message, timestamp, orderNumber }]
};

export const postHistoryLog = async (orderNumber: string, event: string) => {
  await fetch(`${API_BASE_URL}/api/notifications/${orderNumber}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, timestamp: new Date().toISOString() }),
  });
};
