import "./Home.css"
import Navbar from "/src/components/Navbar/Navbar.jsx";
import {useEffect, useState} from "react";
import mockProducts from "/src/components/ProductCard/mockProducts.js"
import ProductCard from "/src/components/ProductCard/ProductCard.jsx"

export default function Home() {

    // Products
    let [products, setProducts] = useState(null);

    // Requires useEffect because will be a fetch to the server
    useEffect(() => {
        setProducts(mockProducts);
    }, [])



    return (
        <>
            <Navbar/>
            <main className="home-main-content">
                <h1 className="mais-vendidos">Mais vendidos</h1>
                <div className="product-display">
                    {products === null ? null : products.map(product => {
                        return (<ProductCard key={product.id} product={product} />)
                    })}
                </div>
                <h1 className="mais-vendidos">Novas adições</h1>
                <div className="product-display">
                    {products === null ? null : products.map(product => {
                        return (<ProductCard key={product.id} product={product} />)
                    })}
                </div>
            </main>
        </>
    )
}