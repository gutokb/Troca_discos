import {createUser, getAllUsers, getUsersByName, getUserById, getUserByEmail} from 'app/service/userService.js';
import {test, expect, describe, beforeAll, afterAll} from "@jest/globals";
import mongoose from "mongoose";
import "dotenv/config"
import {MongoMemoryServer} from "mongodb-memory-server";

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    const newUsers = [
        {
            name : "teste1",
            email : "teste1@example.com",
            password: "password123",
            cpf : "06668975143",
            telephone: "12345678901",
            role : "ADMIN",
        },
        {
            name : "TESTE2",
            email : "teste2@example.com",
            password: "password123",
            cpf : "06668975143",
            telephone: "12345678901",
            role : "ADMIN",
        },
        {
            name : "téstÉ3",
            email : "teste3@example.com",
            password: "password133",
            cpf : "06668975143",
            telephone: "12345678901",
            role : "ADMIN",
        }
    ];

    // Fix: Properly await all user creation
    await Promise.all(newUsers.map(user => createUser(user)));
})

afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    if (mongod) {
        await mongod.stop();
    }
})

test('createUser should return a user', async () => {
    const newUser = {
        name : "John",
        email : "john@example.com",
        password: "password123",
        cpf : "06668975143",
        telephone: "12345678901",
        role : "ADMIN",
    }
    const result = await createUser(newUser);
    console.log(result);
    expect(result).not.toBeNull();
})

test('createUser should return an error if fields are wrong', async () => {
    const wrongUser = {
        name : "John",
        email : "johnexample.com", // Wrong
        password: "pa", // Wrong
        cpf : "0666894", // Wrong
        telephone: "12345678aa1", // Wrong
        role : "ADMINu", // Wrong
    }
    await expect(createUser(wrongUser)).rejects.toThrow();
})

test("get all users", async () => {
    const result = await getAllUsers();
    expect(result.length).toBeGreaterThan(1);
})

test("get users by name", async () => {

    const result = await getUsersByName("teste");
    console.log("Search results:", result); // Debug log
    expect(result.length).toBe(3);
})

test("get user by ID", async () => {
    const newUser = {
        name : "toSearch",
        email : "searched@example.com",
        password: "password123",
        cpf : "06668975143",
        telephone: "12345678901",
        role : "ADMIN",
    }
    const result = await createUser(newUser);
    const fetched = await getUserById(result._id); // Note: use _id instead of id
    expect(result.name).toBe(fetched.name);
})

test("get user by email", async () => {
    // Fix: Properly await the function and then check the property
    const user = await getUserByEmail("teste1@example.com");
    expect(user.email).toBe("teste1@example.com");
})