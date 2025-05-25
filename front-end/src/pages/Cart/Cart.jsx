import ShoppingCart from "../../components/ShoppingCart/ShoppingCart.jsx";
import Navbar from "/src/components/Navbar/Navbar.jsx";
import {API_URL} from "../../config/api.js";

export default function Cart(){

    
     return (
            <>
                <Navbar/>
                <main className="cart-main">
                    <div className="cart-container">
                        <ShoppingCart/>
                    </div>
                </main>
            </>
        )
}