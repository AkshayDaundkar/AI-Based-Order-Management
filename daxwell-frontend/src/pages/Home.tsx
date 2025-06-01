import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchorderapi";

type Order = {
  orderNumber: string;
  status: string;
  lines: { amount: number }[];
};

const Home = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const statusCount = (status: string) =>
    orders.filter((order) => order.status === status).length;

  const totalAmount = orders.reduce((sum, order) => {
    const orderTotal = order.lines.reduce((a, l) => a + l.amount, 0);
    return sum + orderTotal;
  }, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card title="Total Orders" value={orders.length} />
          <Card title="Pending" value={statusCount("Pending")} />
          <Card title="Approved" value={statusCount("Approved")} />
          <Card title="Shipped" value={statusCount("Shipped")} />
          <Card title="Cancelled" value={statusCount("Cancelled")} />
          <Card title="Total Amount" value={`$${totalAmount.toFixed(2)}`} />
        </div>
      )}
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-gray-600">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default Home;
