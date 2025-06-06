/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchorderapi";
import { fetchNotifications } from "../utils/fetchorderapi";
import ChatBot from "../components/Chatbot";

const Home = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [, setLoading] = useState(true);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Metric Cards - Span 2/3 */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        <Metric title="Total Orders" value={orders.length} />
        <Metric title="Pending" value={statusCount("Pending")} />
        <Metric title="Approved" value={statusCount("Approved")} />
        <Metric title="Shipped" value={statusCount("Shipped")} />
        <Metric title="Cancelled" value={statusCount("Cancelled")} />
        <Metric title="Total Amount" value={`$${totalAmount.toFixed(2)}`} />
      </div>

      {/* Activity Sidebar - Span 1/3 */}
      <RecentActivity />
      <ChatBot />
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

const RecentActivity = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    load();
  }, []);

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col justify-between h-[350px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold text-gray-800 dark:text-white">
          Recent Activity
        </h2>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg">
          &#8942;
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400">
              <th className="pb-1">Action</th>
              <th className="pb-1 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {visibleNotifications.length === 0 ? (
              <tr>
                <td colSpan={2} className="italic text-gray-400 py-2">
                  No activity yet
                </td>
              </tr>
            ) : (
              visibleNotifications.map((entry, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2 text-gray-700 dark:text-gray-300">
                    {entry.message}
                  </td>
                  <td className="py-2 text-right text-gray-400 dark:text-gray-500 text-xs">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {notifications.length > 4 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 w-full text-sm text-blue-600 dark:text-blue-400 font-medium py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {showAll ? "Show Less" : "More Notifications →"}
        </button>
      )}
    </div>
  );
};

export default Home;
