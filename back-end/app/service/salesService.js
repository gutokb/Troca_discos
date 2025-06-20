import {User, Record, Sale} from "../model/models.js"
import * as recordService from "../service/recordService.js"
import * as userService from "../service/userService.js"
import * as cartService from "../service/cartService.js"


async function sellOne(user, record) {
    try {
        const newSale =  new Sale({
            buyerId : user._id,
            recordId : record._id,
            price : record.price
        })
        await recordService.updateRecord(record._id,  {stock : record.stock - 1, sold : record.sold + 1});
        await newSale.save();
        return newSale;
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
            for (let i = 0; i < item.quantity; i++) {
                await sellOne(user, item.recordId);
            }
        }
        await cartService.clearCart(user._id);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

