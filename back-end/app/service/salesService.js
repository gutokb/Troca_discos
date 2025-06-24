import {User, Record, Sale} from "../model/models.js"
import * as recordService from "../service/recordService.js"
import * as userService from "../service/userService.js"
import * as cartService from "../service/cartService.js"


async function sellOne(user, record, quantity) {
    try {
        for (let i = 0; i < quantity; i++) {
            const newSale =  new Sale({
                buyerId : user._id,
                recordId : record._id,
                price : record.price
            })
            await newSale.save();
        }
        await recordService.updateRecord(record._id,  {stock : record.stock - quantity, sold : record.sold + quantity});
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}


// User must be populated
export async function sellALl(user) {
    try {
        for (let item of user.shoppingCart) {
            if (item.quantity > item.recordId.stock) {
                throw new Error("Estoque insuficiente")
            }
            await sellOne(user, item.recordId, item.quantity);
        }
        await cartService.clearCart(user._id);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

