// Importa o modelo 'User' definido no Mongoose, que representa os dados dos usuários no banco.
import { User } from "../model/models.js";

/**
 * Cria um novo usuário no banco de dados.
 * Inicializa os campos 'createdAt', 'lastLoginAt' e o carrinho de compras como vazio.
 */
export async function createUser(userData) {
    try {
        const newUser = new User({
            ...userData,                   // Copia todos os dados recebidos do front-end
            createdAt: new Date(),        // Define data atual de criação
            lastLoginAt: new Date(),      // Define último login como agora (opcional)
            shoppingCart: []              // Inicializa carrinho como array vazio
        });
        await newUser.save();             // Salva o novo usuário no banco
        return newUser;
    } catch (err) {
        console.error("Erro ao criar usuário:", err.message);
        throw err;
    }
}

/**
 * Retorna todos os usuários cadastrados no banco.
 * Usa populate para preencher o conteúdo dos discos no carrinho.
 */
export async function getAllUsers() {
    try {
        return await User.find().populate("shoppingCart.recordId");
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

/**
 * Retorna uma lista de usuários cujo nome contém o valor pesquisado.
 * Ignora acentuação ao fazer a busca.
 */
export async function getUsersByName(name) {
    // Mapeia letras acentuadas para regex equivalentes
    const accentMap = {
        'a': '[aáàâãäåāăą]',
        'e': '[eéèêëēĕėęě]',
        'i': '[iíìîïĩīĭįı]',
        'o': '[oóòôõöøōŏő]',
        'u': '[uúùûüũūŭůűų]',
        'c': '[cçćĉċč]',
        'n': '[nñńņňŋ]'
    };

    // Constrói expressão regular para buscar nome com ou sem acento
    const searchTerm = name.toLowerCase()
        .split('')
        .map(char => accentMap[char] || char)
        .join('');

    try {
        return await User.find({
            name: { $regex: searchTerm, $options: 'i' } // busca sem case-sensitive
        }).populate("shoppingCart.recordId");
    } catch (err) {
        console.log(err.message);
        return err;
    }
}

/**
 * Busca um único usuário por ID.
 */
export async function getUserById(id) {
    try {
        return await User.findById(id).populate("shoppingCart.recordId");
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

/**
 * Busca um usuário pelo campo 'email'.
 * Usado no login.
 */
export async function getUserByEmail(email) {
    try {
        return await User.findOne({ email }).populate("shoppingCart.recordId");
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

/**
 * Remove um usuário do banco de dados com base no seu ID.
 */
export async function deleteUser(userId) {
    try {
        return await User.findByIdAndDelete(userId);
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

/**
 * Atualiza os dados de um usuário com base no ID.
 * O parâmetro runValidators garante que as validações do modelo sejam aplicadas.
 */
export async function updateUser(userId, userData) {
    try {
        return await User.updateOne(
            { _id: userId },       // filtro
            { ...userData },       // dados atualizados
            { runValidators: true } // validações de schema ativadas
        );
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

/**
 * Autentica um usuário com base em email e senha.
 * Em produção, este método deveria comparar a senha com um hash (usando bcrypt).
 */
export async function authenticateUser(email, password) {
    try {
        const user = await User.findOne({ email }); // busca usuário pelo email

        if (!user) return null;                     // se não existe, retorna null
        if (user.password !== password) return null; // compara senha (em produção, usar hash!)

        return user; // retorna o usuário autenticado
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}
