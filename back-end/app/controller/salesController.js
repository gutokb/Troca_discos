import * as salesService from "../service/salesService.js";
import * as userService from "../service/userService.js";


export async function sell(req, res) {
    const user = await userService.getUserById(req.params.id)
    if (!user) {
        return res.status(404).send({})
    }
    if (user.shoppingCart.length === 0) {
        return res.status(400).send({message : "User cart is empty"})
    }
    try {
        await salesService.sellALl(user)
    }
    catch (err) {
        return res.status(400).send({message : err.message})
    }
    return res.status(200).end()
}