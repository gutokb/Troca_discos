import {User} from "../model/models.js"


// Criacao de usuario no banco de dados, recebe os dados do formulario como json e converte em
// modelo mongoose, requer que os campos estejam devidademente nomeados
export async function createUser(userData) {
    try{
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function getAllUsers() {
    try {
        return await User.find().populate("shoppingCart.recordId");
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}


export async function getUsersByName(name) {
    const accentMap = {
        'a': '[aáàâãäåāăą]',
        'e': '[eéèêëēĕėęě]',
        'i': '[iíìîïĩīĭįı]',
        'o': '[oóòôõöøōŏő]',
        'u': '[uúùûüũūŭůűų]',
        'c': '[cçćĉċč]',
        'n': '[nñńņňŋ]'
    };
    const searchTerm = name.toLowerCase()
        .split('')
        .map(char => accentMap[char] || char)
        .join('');
    try {
        return await User.find({
            name : {$regex: searchTerm, $options: 'i'},
        }).populate("shoppingCart.recordId");
    }
    catch (err) {
        console.log(err.message);
        return err;
    }
}

export async function getUserById(id) {
    try {
        return await User.findById(id).populate("shoppingCart.recordId");
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function getUserByEmail(email) {
    try {
        return await User.findOne({
            email : email
        }).populate("shoppingCart.recordId")
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}


export async function deleteUser(userId) {
    try {
        return await User.findByIdAndDelete(userId);
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function updateUser(userId, userData) {
    try {
        return await User.updateOne(
            {_id: userId},
            {...userData},
            {runValidators: true},
        );
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}



