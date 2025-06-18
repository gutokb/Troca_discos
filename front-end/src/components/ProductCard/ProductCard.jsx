import {Link, useNavigate} from "react-router-dom";
import "./ProductCard.css"
import placeholderIcon from "/src/assets/vynil.png"


/*
Product card to display in home and search pages
 */

// The product object defined here doesn`t need all values from the DB, but here follows the fields required
/*
product = {
    title : str,
    artist : str,
    year : str | int, //idk
    price : float,
    cover : str
}
 */

export default function ProductCard({product}) {
    const navigate = useNavigate();
    return (
        <div onClick={()=>(navigate(`/details/${product._id}`))} className="product-card">
            <img src={product.coverImgPath} alt="Record cover"/>
            <p>{product.title}</p>
            <p>{product.artist + " - " + product.year}</p>
            <h4>{"R$ " + product.price}</h4>
        </div>
    )
}


