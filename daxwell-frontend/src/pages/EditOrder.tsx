/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOrders,
  postHistoryLog,
  updateOrderAPI,
} from "../utils/fetchorderapi";
import type { Order, OrderLine } from "../types/order";
import Input from "../components/forms/Input";
import Select from "../components/forms/Select";
import MultiSelect from "../components/forms/MultiSelect";
import { toast } from "react-hot-toast";
import { useNotificationLog } from "../context/NotificationContext";
const emptyLine: OrderLine = {
  item: "",
  units: "",
  quantity: 0,
  price: 0,
  amount: 0,
};

const EditOrder = () => {
  const { orderNumber } = useParams();
  const [form, setForm] = useState<Order | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const all = await fetchOrders();
      const existing = all.find((o: Order) => o.orderNumber === orderNumber);
      if (existing) setForm(existing);
    };
    load();
  }, [orderNumber]);

  const handleInput = (key: keyof Order, value: any) => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, [key]: value }));
  };

  const handleLineChange = (
    index: number,
    key: keyof OrderLine,
    value: any
  ) => {
    if (!form) return;
    const newLines: OrderLine[] = [...form.lines];
    const updatedLine: OrderLine = {
      ...newLines[index],
      [key]: key === "quantity" || key === "price" ? Number(value) : value,
    };
    updatedLine.amount = updatedLine.quantity * updatedLine.price;
    newLines[index] = updatedLine;
    setForm((prev) => ({ ...prev!, lines: newLines }));
  };

  const addLine = () => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, lines: [...prev!.lines, emptyLine] }));
  };

  const removeLine = (index: number) => {
    if (!form || form.lines.length <= 1) return;
    setForm((prev) => ({
      ...prev!,
      lines: prev!.lines.filter((_, i) => i !== index),
    }));
  };

  const { addLog } = useNotificationLog();

  const handleSubmit = async () => {
    if (!form) return;
    const errs: string[] = [];
    const req = [
      "orderNumber",
      "customer",
      "transactionDate",
      "status",
      "fromLocation",
      "toLocation",
    ];
    req.forEach(
      (k) => !form[k as keyof Order] && errs.push(`${k} is required`)
    );
    if (form.incoterm && form.freightTerms) {
      errs.push("Select either Incoterm or Freight Terms, not both.");
    }
    setErrors(errs);
    if (errs.length > 0) return;

    try {
      await updateOrderAPI(orderNumber!, form);
      toast.success(`Order ${form.orderNumber} updated`);
      await postHistoryLog(
        form.orderNumber,
        `Order ${form.orderNumber} was Edited`
      );
      addLog(`Order ${form.orderNumber} was edited`);
      navigate("/orders/list");
    } catch (e) {
      alert("Failed to update order.");
      console.error("Update order error:", e);
    }
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Order</h1>
      {errors.length > 0 && (
        <div className="bg-red-100 p-2 text-red-700 rounded mb-4">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Order Number"
          value={form.orderNumber}
          onChange={(v) => handleInput("orderNumber", v)}
        />
        <Input
          label="Customer"
          value={form.customer}
          onChange={(v) => handleInput("customer", v)}
        />
        <Input
          label="Transaction Date"
          type="date"
          value={form.transactionDate}
          onChange={(v) => handleInput("transactionDate", v)}
        />
        <Select
          label="Status"
          options={["Pending", "Approved", "Shipped", "Cancelled"]}
          value={form.status}
          onChange={(v) => handleInput("status", v)}
        />
        <Select
          label="From Location"
          options={["Warehouse A", "Warehouse B", "Warehouse C"]}
          value={form.fromLocation}
          onChange={(v) => handleInput("fromLocation", v)}
        />
        <Input
          label="To Location"
          value={form.toLocation}
          onChange={(v) => handleInput("toLocation", v)}
        />
        <MultiSelect
          label="Pending Approval Reason Code"
          options={[
            "PRICE_DISCREPANCY",
            "CREDIT_HOLD",
            "STOCK_SHORTAGE",
            "CUSTOMER_REQUEST",
          ]}
          values={form.pendingApprovalReasonCode}
          onChange={(v) => handleInput("pendingApprovalReasonCode", v)}
        />
        <Input
          label="Support Rep"
          value={form.supportRep ?? ""}
          onChange={(v) => handleInput("supportRep", v)}
        />
        <Select
          label="Incoterm"
          options={["EXW", "FOB", "CIF", "DDP"]}
          value={form.incoterm ?? ""}
          onChange={(v) => handleInput("incoterm", v)}
        />
        <Select
          label="Freight Terms"
          options={["Prepaid", "Collect"]}
          value={form.freightTerms ?? ""}
          onChange={(v) => handleInput("freightTerms", v)}
        />
        <Input
          label="Total Ship Unit Count"
          type="number"
          value={form.totalShipUnitCount ?? 0}
          onChange={(v) => handleInput("totalShipUnitCount", Number(v))}
        />
        <Input
          label="Total Quantity"
          type="number"
          value={form.totalQuantity ?? 0}
          onChange={(v) => handleInput("totalQuantity", Number(v))}
        />
        <Input
          label="Discount Rate"
          type="number"
          value={form.discountRate ?? 0}
          onChange={(v) => handleInput("discountRate", Number(v))}
        />
        <Input
          label="Early Pickup Date"
          type="date"
          value={form.earlyPickupDate ?? ""}
          onChange={(v) => handleInput("earlyPickupDate", v)}
        />
        <Input
          label="Late Pickup Date"
          type="date"
          value={form.latePickupDate ?? ""}
          onChange={(v) => handleInput("latePickupDate", v)}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Order Lines</h2>
        {form.lines.map((line, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end mb-2"
          >
            <Input
              label="Item"
              value={line.item}
              onChange={(v) => handleLineChange(i, "item", v)}
            />
            <Input
              label="Units"
              value={line.units}
              onChange={(v) => handleLineChange(i, "units", v)}
            />
            <Input
              label="Qty"
              type="number"
              value={line.quantity}
              onChange={(v) => handleLineChange(i, "quantity", v)}
            />
            <Input
              label="Price"
              type="number"
              value={line.price}
              onChange={(v) => handleLineChange(i, "price", v)}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <p>${line.amount.toFixed(2)}</p>
            </div>
            <button
              className="text-red-500"
              onClick={() => removeLine(i)}
              disabled={form.lines.length === 1}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
          onClick={addLine}
          type="button"
        >
          + Add Line
        </button>
      </div>

      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit}
        type="button"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditOrder;
