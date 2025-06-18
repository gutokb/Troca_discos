import {createUser, getAllUsers, getUsersByName, getUserById, getUserByEmail, updateUser, deleteUser} from 'app/service/userService.js';
import {test, expect, describe, beforeAll, afterAll, it} from "@jest/globals";
import {User, Sale, Record} from "app/model/models.js"
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

describe('deleteUser', () => {
    it('should successfully delete an existing user', async () => {
        // Create a test user
        const testUser = new User({
            name: 'Test User',
            cpf: '123.456.789-10',
            email: 'test@example.com',
            telephone: '11987654321',
            password: 'password123'
        });
        await testUser.save();

        // Delete the user
        const result = await deleteUser(testUser._id);

        // Verify the user was deleted
        expect(result).toBeTruthy();
        expect(result._id.toString()).toBe(testUser._id.toString());
        expect(result.name).toBe('Test User');

        // Verify user no longer exists in database
        const deletedUser = await User.findById(testUser._id);
        expect(deletedUser).toBeNull();
    });

    it('should return null when trying to delete non-existent user', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const result = await deleteUser(nonExistentId);

        expect(result).toBeNull();
    });

    it('should throw error when provided invalid userId', async () => {
        const invalidId = 'invalid-id';

        await expect(deleteUser(invalidId)).rejects.toThrow();
    });
});

describe('updateUser', () => {
    it('should successfully update user data', async () => {
        // Create a test user
        const testUser = new User({
            name: 'Original Name',
            cpf: '123.456.789-10',
            email: 'original@example.com',
            telephone: '11987654321',
            password: 'password123'
        });
        await testUser.save();

        const updateData = {
            name: 'Updated Name',
            address: 'New Address',
            role: 'ADMIN'
        };

        // Update the user
        const result = await updateUser(testUser._id, updateData);

        // Verify update result
        expect(result.acknowledged).toBe(true);
        expect(result.modifiedCount).toBe(1);
        expect(result.matchedCount).toBe(1);

        // Verify the user was actually updated
        const updatedUser = await User.findById(testUser._id);
        expect(updatedUser.name).toBe('Updated Name');
        expect(updatedUser.address).toBe('New Address');
        expect(updatedUser.role).toBe('ADMIN');
        expect(updatedUser.email).toBe('original@example.com'); // Unchanged
    });

    it('should return matchedCount 0 when trying to update non-existent user', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const updateData = { name: 'New Name' };

        const result = await updateUser(nonExistentId, updateData);

        expect(result.acknowledged).toBe(true);
        expect(result.matchedCount).toBe(0);
        expect(result.modifiedCount).toBe(0);
    });

    it('should throw error when update data violates schema validation', async () => {
        const testUser = new User({
            name: 'Test User',
            cpf: '123.456.789-10',
            email: 'test@example.com',
            telephone: '11987654321',
            password: 'password123'
        });
        await testUser.save();

        const invalidUpdateData = {
            email: 'invalid-email', // Invalid email format
            telephone: '123' // Invalid telephone format
        };

        await expect(updateUser(testUser._id, invalidUpdateData)).rejects.toThrow();
    });

    it('should throw error when provided invalid userId', async () => {
        const invalidId = 'invalid-id';
        const updateData = { name: 'New Name' };

        await expect(updateUser(invalidId, updateData)).rejects.toThrow();
    });
});