import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { InventoryPage } from "./pages/InventoryPage";
import { UsersPage } from "./pages/UsersPage";
import { Dashboard } from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";
import { EmailPage } from "./pages/EmailPage.jsx";

export const App = () => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!user) return <Login />;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryPage />;
      case "users":
        return user.user.role === "ADMIN" ? <UsersPage /> : <Dashboard />;
      case "email":  // Add this new case
        return user.user.role === "ADMIN" ? <EmailPage /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  );
};