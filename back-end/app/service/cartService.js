import {User, Record, Sale} from "../model/models.js";


export async function addRecordToCart(userId, recordId, quantity) {
    try {
        const result = await User.findOneAndUpdate(userId, {
            $push: {
                shoppingCart: {
                    quantity: quantity,
                    recordId: recordId,
                }
            },
        },
        { new: true }
        )
        if (result === null) {
            throw new Error(`${userId} not found`);
        }
    }
    catch(err) {
        console.log(err.message);
        throw err;
    }
}

export async function removeRecordFromCart(userId, recordId) {
    try {
        const result = await User.findOneAndUpdate(userId, {
            $pull: {
                shoppingCart: {recordId : recordId},
            }
        },
        { new: true }
        )
        if (result === null) {
            throw new Error(`${userId} not found`);
        }
    }
    catch(err) {
        console.log(err.message);
        throw err;
    }
}

export async function updateRecordQuantity(userId, recordId, newQuantity) {
    try {
        const result = await User.findOneAndUpdate(
            {
                _id: userId,
                "shoppingCart.recordId": recordId
            },
            {
                $set: {"shoppingCart.$.quantity": newQuantity}
            },
            {new: true}
        );
        if (result === null) {
            throw new Error(`${userId} not found`);
        }
    }
    catch(err) {
        console.log(err.message);
        throw err;
    }
}

export async function clearCart(userId) {
    try {
        const result = await User.findOneAndUpdate(userId, {
            $set: {shoppingCart : []}
        })
        if (result === null) {
            throw new Error(`${userId} not found`);
        }
    }
    catch(err) {
        console.log(err.message);
        throw err;
    }
}