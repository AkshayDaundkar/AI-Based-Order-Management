// src/pages/OrderList.tsx
import { useEffect, useState } from "react";
import {
  deleteOrderAPI,
  fetchOrders,
  postHistoryLog,
} from "../utils/fetchorderapi";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNotificationLog } from "../context/NotificationContext";

interface Order {
  orderNumber: string;
  customer: string;
  transactionDate: string;
  latePickupDate: string;
  status: string;
  lines: { amount: number }[];
  pendingApprovalReasonCode?:
    | "PRICE_DISCREPANCY"
    | "CREDIT_HOLD"
    | "STOCK_SHORTAGE"
    | "CUSTOMER_REQUEST";
}

const statuses = ["All", "Pending", "Approved", "Shipped", "Cancelled"];

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [sortColumn, setSortColumn] = useState<keyof Order | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const { addLog } = useNotificationLog();

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const filtered = orders.filter((order) => {
    const statusMatch =
      filteredStatus === "All" || order.status === filteredStatus;
    const searchMatch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA === undefined && valB === undefined) return 0;
    if (valA === undefined) return sortAsc ? -1 : 1;
    if (valB === undefined) return sortAsc ? 1 : -1;
    return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortAsc((prev) => !prev);
    } else {
      setSortColumn(column);
      setSortAsc(true);
    }
  };

  const getTotalAmount = (order: Order) =>
    order.lines.reduce((sum, l) => sum + l.amount, 0);

  const deleteOrder = async (orderNumber: string) => {
    try {
      await deleteOrderAPI(orderNumber);
      setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
      toast.success(`Order ${orderNumber} deleted`);
      await postHistoryLog(orderNumber, `Order ${orderNumber} was deleted`);
      addLog(`Order ${orderNumber} was deleted`);
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order.");
    }
  };

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedOrders = sorted.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Latest Orders
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filteredStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
              onClick={() => setFilteredStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("orderNumber")}
              >
                Order Number
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("customer")}
              >
                Customer
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("transactionDate")}
              >
                Created Date
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("latePickupDate")}
              >
                Due Date
              </th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              {filteredStatus === "Pending" && (
                <th className="px-4 py-3 text-left">Pending Reason</th>
              )}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.orderNumber}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {order.customer}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(order.transactionDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(order.latePickupDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                  ${getTotalAmount(order).toFixed(2)}
                </td>
                {filteredStatus === "Pending" && (
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {order.pendingApprovalReasonCode || "-"}
                  </td>
                )}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right relative group">
                  <button className="text-gray-500 dark:text-gray-300">
                    <FiMoreVertical />
                  </button>

                  <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10 hidden group-hover:block">
                    <button
                      onClick={() =>
                        navigate(`/orders/view/${order.orderNumber}`)
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/orders/edit/${order.orderNumber}`)
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOrder(order.orderNumber)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 border rounded text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Previous
        </button>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`w-8 h-8 text-sm rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 border rounded text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;
