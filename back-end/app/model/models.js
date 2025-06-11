import mongoose from "mongoose";
const { Schema } = mongoose;



const recordSchema = new Schema({
    title: {type:String, required:true, maxLength:255},
    artist: {type:String, required:true, maxLength:255},
    year: Number,
    genre: [{type:String, maxLength:255}],
    price: {type:Number, required:true, min:0},
    stock: {type:Number, required:true, min:0},
    coverImgPath: String,
    sold: {type:Number, required:true, min:0, default:0},
    createdAt: {type:Date, required:true, default: Date.now},
    tracks: [{
        title: {type:String, maxLength:255},
        audioPath: String,
    }]
})



const userSchema = new Schema({
    name: {type:String, required:true, maxLength:255},
    cpf: {
        type:String,
        required:true,
        // CPF em quase todos os formatos
        match:/([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/
    },
    email: {
        type:String,
        required:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, //todo email valido
        minLength:1,
        maxLength:255
    },
    telephone: {
        type:String,
        required:true,
        match:/[0-9]{11}/ // 11 numeros corridos com DDD
    },
    role : {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER"
    },
    password: {
        type:String,
        required:true,
        minLength:6,
        maxLength:30,
    },
    shoppingCart : [{
        quantity : Number,
        recordId : {type: Schema.Types.ObjectId, ref: 'Records'}
    }],
    createdAt: {type:Date, required:true, default: Date.now},
    lastLoginAt: {type:Date, required:true, default: Date.now}
})



const salesSchema = new Schema({
    recordId: {type: Schema.Types.ObjectId, ref: 'Records'},
    buyerId: {type: Schema.Types.ObjectId, ref: 'Users'},
    price: {type:Number, required:true, min:0},
    timestamp: {type:Date, required:true, default: Date.now}
})















