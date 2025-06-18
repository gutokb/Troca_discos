import express from 'express';
import * as cartController from '../controller/cartController.js';


const router = express.Router();

/*
* in every path :user is the user id
* all but clean require the body to have the json
* {
*   "recordId" : <record_id>
*   "quantity" : <quantity>  // EXCEPTION: remove doesn`t need quantity
*  }
* */


router.post("/add/:user", cartController.addToCart)

router.put("/set-quantity/:user", cartController.updateQuantity)

router.delete("/remove/:user", cartController.removeFromCart);

router.delete("/clear/:user", cartController.clearCart);

export default router;