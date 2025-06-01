import { useEffect, useState } from "react";
import { fetchOrders } from "../utils/fetchorderapi";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Order = {
  orderNumber: string;
  customer: string;
  transactionDate: string;
  status: string;
  lines: { amount: number }[];
};

const statuses = ["All", "Pending", "Approved", "Shipped", "Cancelled"];

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [sortColumn, setSortColumn] = useState<keyof Order | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const filtered = orders.filter((order) =>
    filteredStatus === "All" ? true : order.status === filteredStatus
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  const getTotalAmount = (order: Order) =>
    order.lines.reduce((sum, l) => sum + l.amount, 0);

  const deleteOrder = (orderNumber: string) => {
    setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex gap-2 mb-4">
        {statuses.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              filteredStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setFilteredStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              {["orderNumber", "customer", "transactionDate", "status"].map(
                (col) => (
                  <th
                    key={col}
                    onClick={() => {
                      setSortColumn(col as keyof Order);
                      setSortAsc((prev) => (sortColumn === col ? !prev : true));
                    }}
                    className="px-4 py-2 text-left cursor-pointer"
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </th>
                )
              )}
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((order) => (
              <tr key={order.orderNumber} className="border-t">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">
                  {new Date(order.transactionDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">${getTotalAmount(order)}</td>
                <td className="px-4 py-2 relative">
                  <div className="group inline-block">
                    <FiMoreVertical className="cursor-pointer" />
                    <div className="absolute hidden group-hover:block right-0 bg-white border rounded shadow mt-1 z-10">
                      <button
                        onClick={() =>
                          navigate(`/orders/view/${order.orderNumber}`)
                        }
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteOrder(order.orderNumber)}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
