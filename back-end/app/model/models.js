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
    tracks: {
        type: [{
        title: {type:String, maxLength:255},
        audioPath: String,
    }],
    default: []
    }
})



const userSchema = new Schema({
    name: {type:String, required:true, maxLength:255},
    cpf: {
        type:String,
        required:[true, "CPF obrigatório"],
        // CPF em quase todos os formatos
        match:[/([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/, "CPF inválido"]
    },
    email: {
        type:String,
        unique:[true, "Email já utilizado"],
        required:[true, "Email obrigatório"],
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email inválido"], //todo email valido
        minLength:1,
        maxLength:255
    },
    telephone: {
        type:String,
        required:[true, "Telefone obrigatório"],
        match:[/[0-9]{11}/, "Telefone inválido"] // 11 numeros corridos com DDD
    },
    role : {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER"
    },
    password: {
        type:String,
        required:[true, "Senha obrigatória"],
        minLength:[6, "Senha deve ter ao menos 6 caracteres"],
        maxLength:[30, "Senha deve ter ao máximo 30 caracteres"],
    },
    shoppingCart : [{
        quantity : Number,
        recordId : {type: Schema.Types.ObjectId, ref: 'Record'},
    }],
    address : String,
    card_info : {
        number: {type:String, match:[/[0-9]{16}/, "Número inválido"]}, // 16 digitos corridos
        cvv : {type:String, match:[/[0-9]{3}/, "CVV inválido"]}, // NNN
        expiration : {type:String, match:[/[0-9]{2}\/[0-9]{2}/, "Validade inválida"]} // MM/AA
    },
    createdAt: {type:Date, required:true, default: Date.now, immutable:true},
    lastLoginAt: {type:Date, required:true, default: Date.now}
})



const salesSchema = new Schema({
    recordId: {type: Schema.Types.ObjectId, ref: 'Record'},
    buyerId: {type: Schema.Types.ObjectId, ref: 'User'},
    price: {type:Number, required:true, min:0},
    timestamp: {type:Date, required:true, default: Date.now}
})

const Record = mongoose.model("Record", recordSchema);

const User = mongoose.model("User", userSchema);

const Sale = mongoose.model("Sale", salesSchema);

export { Record, User, Sale };













