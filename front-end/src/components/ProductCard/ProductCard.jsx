import { Link, useNavigate } from "react-router-dom"; // Importa Link e hook para navegação programática
import "./ProductCard.css" // Importa estilos específicos do cartão de produto

// Componente funcional que recebe um objeto product como prop
export default function ProductCard({ product }) {
    // Hook para navegação via código (sem usar Link diretamente)
    const navigate = useNavigate();

    return (
        // Container clicável que ao ser clicado navega para a página de detalhes do produto
        <div
            onClick={() => (navigate(`/details/${product._id}`))}
            className="product-card"
        >
            {/* Imagem da capa do disco */}
            <img src={product.coverImgPath} alt="Record cover" />

            {/* Título do disco */}
            <p>{product.title}</p>

            {/* Artista e ano concatenados */}
            <p>{product.artist + " - " + product.year}</p>

            {/* Preço formatado com prefixo R$ */}
            <h4>{"R$ " + product.price}</h4>
        </div>
    );
}
