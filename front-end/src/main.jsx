import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Cart from './pages/Cart/Cart.jsx';
import Profile from './pages/Profile/Profile.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/product" element={<Home/>}/>
          <Route path="/admin/*" element={<AdminDashboard/>}/>
          <Route path="/shopping-cart" element={<Cart/>}/>
          <Route path="/profile" element={<Profile/>}/>
      </Routes>
  </BrowserRouter>
)
