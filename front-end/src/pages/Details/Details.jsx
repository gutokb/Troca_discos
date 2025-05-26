import { useParams } from "react-router-dom";
import ProductDetails from "../../components/productDetails/ProductDetails.jsx";
import Navbar from "/src/components/Navbar/Navbar.jsx";

export default function Details(){
    const params = useParams();
    console.log(params)
    
     return (
            <>
                <Navbar/>
                <main className="profile-main">
                    <div className="profile-container">
                        <ProductDetails productID={params.productID}/>
                    </div>
                </main>
            </>
        )
}