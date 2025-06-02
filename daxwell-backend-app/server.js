const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const ordersPath = path.resolve(__dirname, "./orders.json");

//GET endpoint to fetch orders
app.get("/api/orders", (req, res) => {
  fs.readFile(ordersPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading orders.json:", err);
      return res.status(500).json({ error: "Failed to load orders" });
    }

    try {
      const orders = JSON.parse(data);
      res.json(orders);
    } catch (parseErr) {
      console.error("Error parsing orders.json:", parseErr);
      return res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

// POST endpoint to add a new order
app.post("/api/orders", (req, res) => {
  const newOrder = req.body;

  fs.readFile(ordersPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    let orders = [];
    try {
      orders = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: "Corrupted orders.json" });
    }

    orders.push(newOrder);

    fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save order" });

      res.status(201).json({ message: "Order saved successfully" });
    });
  });
});

// PUT endpoint to update an order by orderNumber
app.put("/api/orders/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const updatedOrder = req.body;

  fs.readFile(ordersPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    let orders = [];
    try {
      orders = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: "Corrupted orders.json" });
    }

    const index = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (index === -1) return res.status(404).json({ error: "Order not found" });

    orders[index] = updatedOrder;

    fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to update order" });

      res.json({ message: "Order updated successfully" });
    });
  });
});

// DELETE endpoint to remove an order by orderNumber
app.delete("/api/orders/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;

  fs.readFile(ordersPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    let orders = [];
    try {
      orders = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: "Corrupted orders.json" });
    }

    const filtered = orders.filter((o) => o.orderNumber !== orderNumber);

    fs.writeFile(ordersPath, JSON.stringify(filtered, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete order" });

      res.json({ message: "Order deleted successfully" });
    });
  });
});

app.get("/api/notifications", (req, res) => {
  fs.readFile(ordersPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });
    try {
      const orders = JSON.parse(data);
      const allLogs = orders.flatMap((order) =>
        (order.history || []).map((entry) => ({
          message: entry.event || "Unknown Action",
          timestamp: entry.timestamp,
          orderNumber: order.orderNumber,
        }))
      );
      const sortedLogs = allLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      res.json(sortedLogs.slice(0, 20));
    } catch (err) {
      res.status(500).json({ error: "Failed to parse orders" });
    }
  });
});

// New route to append a history entry to an order
app.post("/api/notifications/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const newEntry = req.body; // expects: { event, timestamp }

  fs.readFile(ordersPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });
    try {
      const orders = JSON.parse(data);
      const index = orders.findIndex((o) => o.orderNumber === orderNumber);
      if (index === -1)
        return res.status(404).json({ error: "Order not found" });

      if (!orders[index].history) {
        orders[index].history = [];
      }
      orders[index].history.push(newEntry);

      fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), (err) => {
        if (err)
          return res.status(500).json({ error: "Failed to update history" });
        res.json({ message: "History entry added" });
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to parse orders" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
