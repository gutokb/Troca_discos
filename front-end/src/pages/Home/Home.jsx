import "./Home.css"
import Navbar from "/src/components/Navbar/Navbar.jsx";
import {useEffect, useState} from "react";
import { API_URL } from "../../config/api.js";
import ProductCard from "/src/components/ProductCard/ProductCard.jsx"
import { getAllRecords } from "../../services/recordService.js";

export default function Home() {

    // Products
    let [products, setProducts] = useState(null);
    let [mostSold, setMostsold] = useState(null);
    let [recent, setRecent] = useState(null);

    // Requires useEffect because will be a fetch to the server
    useEffect(() => {
         async function fetchProducts() {
                            const response = await getAllRecords();
                            setProducts(response);
                        }
                        fetchProducts();
    }, [])

    useEffect(()=>{
        if(products!=null){
            setMostsold(products.sort((a,b)=>{ return b.sold - a.sold}).slice(0,6))
            setRecent(products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,6))
        }

    },[products])



    return (
        <>
            <Navbar/>
            <main className="home-main-content">
                <h1 className="mais-vendidos">Mais vendidos</h1>
                <div className="product-display">
                    {mostSold === null ? null : mostSold.map(product => {
                        return (<ProductCard key={product.id} product={product} />)
                    })}
                </div>
                <h1 className="mais-vendidos">Novas adições</h1>
                <div className="product-display">
                    {recent === null ? null : recent.map(product => {
                        return (<ProductCard key={product.id} product={product} />)
                    })}
                </div>
            </main>
        </>
    )
}