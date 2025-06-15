import {User} from "app/model/models.js"


// Criacao de usuario no banco de dados, recebe os dados do formulario como json e converte em
// modelo mongoose, requer que os campos estejam devidademente nomeados
async function createUser(userData) {
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

async function getAllUsers() {
    try {
        return await User.find();
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}


async function getUsersByName(name) {
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
        });
    }
    catch (err) {
        console.log(err.message);
        return err;
    }
}

async function getUserById(id) {
    try {
        return await User.findById(id);
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

async function getUserByEmail(email) {
    try {
        return await User.findOne({
            email : email
        })
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}


async function deleteUser(useriD) {
    try {
        return await User.findByIdAndDelete(useriD);
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}



export {createUser, getAllUsers, getUsersByName, getUserById, getUserByEmail};