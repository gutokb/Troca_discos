import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from "../../components/Navbar/Navbar";

export default function Search() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${API_URL}/records`);
      const data = await response.json();
      setProducts(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const results = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.artist.toLowerCase().includes(query.toLowerCase()) ||
        product.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
    );
    setFiltered(results);
  }, [products, query]);

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <h1>Resultados para: "{query}"</h1>
        {filtered.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="product-display">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
