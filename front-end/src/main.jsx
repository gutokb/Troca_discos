// Importa o modo estrito do React para identificar problemas no código
import { StrictMode } from 'react'

// Cria a raiz da aplicação usando o novo método do React 18+
import { createRoot } from 'react-dom/client'

// Importa os estilos globais
import './index.css'

// Importa componentes de roteamento para navegação entre páginas
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importa as páginas principais da aplicação
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Cart from './pages/Cart/Cart.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Details from './pages/Details/Details.jsx';
import Unauthorized from './pages/Unauthorized/Unauthorized.jsx';


// Importa o componente de rota protegida (autenticação/autorização)
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

// Importa página para exibição de produtos pesquisados
import SearchProduct from './pages/SearchProduct/SearchProduct.jsx';

// Importações do React (não é necessário aqui pois já foi importado no início)
import React from 'react';

// Importa e registra os componentes necessários do Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Importa os tipos de gráficos (Line, Bar, Pie, Doughnut) da biblioteca react-chartjs-2
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Importa o componente de rodapé
import Footer from "./components/Footer/Footer.jsx";

// Registra os componentes do Chart.js globalmente para serem usados nos gráficos
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Renderiza a aplicação React na div com id "root"
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Página inicial */}
      <Route path="/" element={<Home />} />

      {/* Autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Busca de produtos por query na URL */}
      <Route path="/product/:query" element={<SearchProduct />} />
      <Route path="/product/" element={<SearchProduct />} /> {/* Rota redundante mas útil para buscas vazias */}

      {/* Área de administrador (rota protegida apenas para ADMIN) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Perfil do usuário (acesso permitido a USER e ADMIN) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Carrinho de compras (também protegido) */}
      <Route
        path="/shopping-cart"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* Página de detalhes de um produto específico */}
      <Route path="/details/:productID" element={<Details />} />

      {/* Página exibida quando o usuário tenta acessar algo sem permissão */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Página para qualquer rota inexistente */}
      <Route path="*" element={<p>❌ Página não encontrada</p>} />
    </Routes>

    {/* Rodapé presente em todas as páginas */}
    <Footer />
  </BrowserRouter>
);
