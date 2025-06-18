import * as userService from '../service/userService.js';
import req from "express/lib/request.js";
import res from "express/lib/response.js";





export async function get(req, res) {
    if (!!req.query?.name) {
        const result = await userService.getUsersByName(req.query.name);
        if (result) {
            res.status(200).json(result);
        }
        res.status(404).end();
    }
    if (!!req.query?.email) {
        const result = await userService.getUserByEmail(req.query.email);
        if (result) {
            res.status(200).json(result);
        }
        res.status(404).end();
    }
    return res.status(200).json(await userService.getAllUsers());
}


export async function getById(req, res) {
    try {
        const result = await userService.getUserById(req.params.id);
        if (!result) {
            res.status(404).json({});
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

export async function create(req, res) {
    const userData = req.body;
    try {
        const createdUser = await userService.createUser(userData);
        res.status(201).json(createdUser);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function update(req, res) {
    const userData = req.body;
    try {
        const updatedUser = await userService.updateUser(req.params.id, userData);
        if (updatedUser.matchedCount === 0) {
            res.status(404).end();
        }
        return res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const result = await userService.deleteUser(req.params.id);
        if (result.matchedCount === 0) {
            res.status(404).end();
        }
        return res.status(200).end();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
