import {User, Record, Sale} from "../model/models.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;


export async function addRecordToCart(userId, recordId, quantity) {
    try {
        const result = await User.findByIdAndUpdate(userId, {
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
        const result = await User.findByIdAndUpdate(userId, {
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
                _id: new ObjectId(userId),
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
        const result = await User.findByIdAndUpdate(userId, {
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