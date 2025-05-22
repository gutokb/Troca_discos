import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>}></Route>
      </Routes>
  </BrowserRouter>
)
