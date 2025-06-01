/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchorderapi";

const Home = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, []);

  const statusCount = (status: string) =>
    orders.filter((o) => o.status === status).length;

  const totalAmount = orders.reduce(
    (sum, order) =>
      sum + order.lines.reduce((a: number, l: any) => a + l.amount, 0),
    0
  );

  return (
    <div className="p-6 bg-[#f9fafb] dark:bg-[#0f172a] min-h-screen">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Metric title="Total Orders" value={orders.length} />
          <Metric title="Pending" value={statusCount("Pending")} />
          <Metric title="Approved" value={statusCount("Approved")} />
          <Metric title="Shipped" value={statusCount("Shipped")} />
          <Metric title="Cancelled" value={statusCount("Cancelled")} />
          <Metric title="Total Amount" value={`$${totalAmount.toFixed(2)}`} />
        </div>
      )}
    </div>
  );
};

const Metric = ({ title, value }: { title: string; value: any }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 shadow-sm">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
    <p className="text-2xl font-semibold text-gray-800 dark:text-white">
      {value}
    </p>
  </div>
);

export default Home;
