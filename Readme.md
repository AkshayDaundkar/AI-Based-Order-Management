# Daxwell Orders Management Dashboard

A modern, fully responsive **Orders Management System** built with **React + TypeScript** on the frontend and **Node.js + Express** for the backend.

---

## Features

- **Create, View, Edit, Delete Orders**
- Dashboard with status metrics and total amount
- Powerful **search**, **filter**, and **sorting**
- Dark mode with persistent toggle
- **Notification system** (with bell icon + sidebar log)
- Fully **mobile responsive**
- Backend with persistent JSON file store
- Recent activity with timestamped logs

---

## Project Structure

```
/client
  /src
    /pages
      - Home.tsx
      - OrderList.tsx
      - CreateOrder.tsx
      - EditOrder.tsx
      - ViewOrder.tsx
    /components
      - Topbar.tsx
      - Sidebar.tsx
      - UserModal.tsx
      - forms/
        - Input.tsx
        - Select.tsx
        - MultiSelect.tsx
    /context
      - NotificationContext.tsx
    /utils
      - fetchorderapi.ts
    /types
      - order.ts
/server
  - server.js
  - orders.json
  - notifications.json
```

---

## Getting Started

### Backend Setup

```bash
cd server
npm install
node server.js
```

Your backend will run at: **http://localhost:4000**

### Available Endpoints

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/orders`              | Fetch all orders           |
| POST   | `/api/orders`              | Create new order           |
| PUT    | `/api/orders/:orderNumber` | Update an order            |
| DELETE | `/api/orders/:orderNumber` | Delete an order            |
| GET    | `/api/notifications`       | Get recent notifications   |
| POST   | `/api/notifications`       | Add a new notification log |

---

### 💻 Frontend Setup

```bash
cd client
npm install
npm run dev
```

Runs at: **http://localhost:5173**

---

## Application Flow

- **Home Page**
  - Dashboard cards for total orders, statuses, total amount
  - Side activity panel showing recent 4 logs
- **Orders Page**
  - Displays paginated, searchable and sortable table
  - Actions: View, Edit, Delete
- **Create Order**
  - Fill out complete order info and items
  - Logs a `created` history entry
- **Edit Order**
  - Pre-populates fields, allows updating
  - Logs an `edited` history entry
- **View Order**
  - Shows all details, lines, addresses, and history
- **Notifications**
  - Red dot on bell when new log is created
  - Toggled modal shows 5 most recent logs
  - All logs fetched from `notifications.json`

---

## JSON Data Format

### Order Object

```json
{
  "orderNumber": "ORD-1001",
  "customer": "Acme Inc.",
  "status": "Pending",
  "transactionDate": "2025-06-01",
  "latePickupDate": "2025-06-03",
  "pendingApprovalReasonCode": [],
  "supportRep": "Alice",
  "fromLocation": "Warehouse A",
  "toLocation": "Site X",
  "lines": [
    {
      "item": "Widget",
      "units": "pcs",
      "quantity": 10,
      "price": 25,
      "amount": 250
    }
  ],
  "history": [
    {
      "timestamp": "2025-06-01T10:00:00",
      "event": "Order Created"
    }
  ]
}
```

---

## Additional Notes

- Notifications are both **client-side (context)** and **persisted in backend**
- Use `toast.success()` for real-time alerts
- Cards + tables use TailwindCSS for clean UI
- Responsiveness managed with utility classes and flex/grid

---

## Contact

Made with 💻 for Daxwell Demo by Akshay Daundkar

2025-06-02
