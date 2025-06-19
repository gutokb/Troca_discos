import * as cartService from '../service/cartService.js';


export async function addToCart(req, res) {
    try {
        if (!req.params.user || !req.body.quantity ||  !req.body.recordId) {
            res.status(400).end()
            return
        }
        await cartService.addRecordToCart(req.params.user, req.body.recordId, req.body.quantity);
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        res.status(404).end();
    }
}

export async function removeFromCart(req, res) {
    try {
        if (!req.params.user ||  !req.body.recordId) {
            res.status(400).end()
            return
        }
        await cartService.removeRecordFromCart(req.params.user, req.body.recordId)
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        res.status(404).end();
    }
}

export async function updateQuantity(req, res) {
    try {
        if (!req.params.user || !req.body.quantity ||  !req.body.recordId) {
            res.status(400).end()
            return
        }
        await cartService.updateRecordQuantity(req.params.user, req.body.recordId, req.body.quantity);
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        res.status(404).end();
    }
}
export async function clearCart(req, res) {
    try {
        if (!req.params.user) {
            res.status(400).end()
            return
        }
        await cartService.clearCart(req.params.user);
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        res.status(404).end();
    }
}
