import React, {useEffect, useState} from 'react';
import {API_URL} from "../../config/api.js";



export default function(props){

    const [curProduct,setProduct] = useState(props.productID);
    const [productData,setProductData] = useState(null);

    useEffect(()=>{
         async function fetchProduct() {
                    const response = await fetch(`${API_URL}/records/${curProduct}`);
                    const data = await response.json();
                    setProductData(data);
                }
                fetchProduct();

    },[curProduct])

    return(<>
        { productData!=null &&(
        <div className="product-container">
            <div className="image-container">
                <img src={productData.cover}/>
            </div>
            <div className="details-container"> 
                <div className='details-text'>
                    <p>{productData.title}</p>
                    <p>{productData.artist}</p>
                    <p>{productData.year}</p>
                    <div className='genres'>
                    <ul>
                    {productData.genre.map((genre)=><li key ={genre}>{genre}</li>)}
                    </ul>
                    </div>
                </div>
                <div className='details-audio'>

                </div>
                <div className='action-container'>
                    <button className='cart-btn'> Adicionar ao carrinho</button>
                    <button className='checkout-btn'> Finalizar Compra</button>
                </div>
            </div>
        </div>
        )
        }
    </>)


}

