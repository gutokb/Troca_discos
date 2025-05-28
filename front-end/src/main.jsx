import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Cart from './pages/Cart/Cart.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Details from './pages/Details/Details.jsx';
import Unauthorized from './pages/Unauthorized/Unauthorized.jsx';
import Search from "./pages/Search/Search.jsx";

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/shopping-cart" element={<Cart />} />
      <Route path="/details/:productID" element={<Details />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<p>❌ Página não encontrada</p>} />
    </Routes>
  </BrowserRouter>
);
