// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import CreateOrder from "./pages/CreateOrder";
import OrderList from "./pages/OrderList";
import ViewOrder from "./pages/ViewOrder";
import EditOrder from "./pages/EditOrder";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Router>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="flex-1 p-4 overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/orders/create" element={<CreateOrder />} />
                <Route path="/orders/list" element={<OrderList />} />
                <Route
                  path="/orders/view/:orderNumber"
                  element={<ViewOrder />}
                />
                <Route
                  path="/orders/edit/:orderNumber"
                  element={<EditOrder />}
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
