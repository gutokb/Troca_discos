// Importa o hook useParams para acessar parâmetros da URL
import { useParams } from "react-router-dom";

// Importa componentes reutilizáveis para exibir detalhes do produto e a barra de navegação
import ProductDetails from "../../components/productDetails/ProductDetails.jsx";
import Navbar from "/src/components/Navbar/Navbar.jsx";

// Componente que exibe os detalhes de um produto específico
export default function Details() {
    const params = useParams(); // Obtém os parâmetros da URL (ex: productID)
    console.log(params); // Log para debug, mostra os parâmetros recebidos

    return (
        <>
            <Navbar />
            <main className="profile-main">
                <div className="profile-container">
                    {/* Passa o productID extraído da URL para o componente que mostra os detalhes */}
                    <ProductDetails productID={params.productID} />
                </div>
            </main>
        </>
    );
}
