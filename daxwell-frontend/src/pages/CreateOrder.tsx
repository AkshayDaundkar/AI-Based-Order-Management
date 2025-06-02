/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/CreateOrder.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, postHistoryLog } from "../utils/fetchorderapi";
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

const CreateOrder = () => {
  const [form, setForm] = useState<Order>({
    orderNumber: "",
    customer: "",
    transactionDate: "",
    status: "",
    fromLocation: "",
    toLocation: "",
    pendingApprovalReasonCode: [],
    supportRep: "",
    incoterm: "",
    freightTerms: "",
    totalShipUnitCount: 0,
    totalQuantity: 0,
    discountRate: 0,
    billingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    earlyPickupDate: "",
    latePickupDate: "",
    lines: [emptyLine],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleInput = (key: keyof Order, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLineChange = (
    index: number,
    key: keyof OrderLine,
    value: any
  ) => {
    const newLines = [...form.lines];
    newLines[index][key] =
      key === "quantity" || key === "price" ? Number(value) : value;
    newLines[index].amount = newLines[index].quantity * newLines[index].price;
    setForm((prev) => ({ ...prev, lines: newLines }));
  };

  const addLine = () =>
    setForm((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        { item: "", units: "", quantity: 0, price: 0, amount: 0 },
      ],
    }));

  const removeLine = (index: number) =>
    setForm((prev) => ({
      ...prev,
      lines:
        prev.lines.length > 1
          ? prev.lines.filter((_, i) => i !== index)
          : prev.lines,
    }));

  const validate = (): boolean => {
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
    return errs.length === 0;
  };

  const { addLog } = useNotificationLog();

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createOrder(form);
      toast.success(`Order ${form.orderNumber} created`);
      await postHistoryLog(
        form.orderNumber,
        `Order ${form.orderNumber} was created`
      );
      addLog(`Order ${form.orderNumber} was created`);
      navigate("/orders/list");
    } catch (err) {
      alert("Failed to submit order.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-[#0f172a] text-gray-800 dark:text-white min-h-screen rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      {errors.length > 0 && (
        <div className="bg-red-100 dark:bg-red-900 p-3 text-red-800 dark:text-red-300 rounded mb-4">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Inputs */}
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
          options={["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D"]}
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
          onChange={(values) =>
            handleInput("pendingApprovalReasonCode", values)
          }
        />
        <Input
          label="Support Rep"
          value={form.supportRep ?? ""}
          onChange={(v) => handleInput("supportRep", v)}
        />
        <Select
          label="Incoterm"
          options={["EXW", "FOB", "CIF", "DDP", "DAP"]}
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
        <h2 className="text-xl font-bold mb-2">Billing Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["street", "city", "state", "postalCode", "country"].map((k) => (
            <Input
              key={k}
              label={k}
              value={
                form.billingAddress?.[k as keyof typeof form.billingAddress] ??
                ""
              }
              onChange={(v) =>
                handleInput("billingAddress", {
                  ...form.billingAddress,
                  [k]: v,
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["street", "city", "state", "postalCode", "country"].map((k) => (
            <Input
              key={k}
              label={k}
              value={
                form.shippingAddress?.[
                  k as keyof typeof form.shippingAddress
                ] ?? ""
              }
              onChange={(v) =>
                handleInput("shippingAddress", {
                  ...form.shippingAddress,
                  [k]: v,
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Order Lines</h2>
        {form.lines.map((line, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mb-3 bg-gray-50 dark:bg-gray-800 p-4 rounded"
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
              <p className="text-gray-800 dark:text-gray-100">
                ${line.amount.toFixed(2)}
              </p>
            </div>
            <button
              className="text-red-500 text-sm"
              onClick={() => removeLine(i)}
              disabled={form.lines.length === 1}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={addLine}
          type="button"
        >
          + Add Line
        </button>
      </div>

      <button
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        onClick={handleSubmit}
        type="button"
      >
        Submit Order
      </button>
    </div>
  );
};

export default CreateOrder;
