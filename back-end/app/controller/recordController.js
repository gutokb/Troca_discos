import * as recordService from '../service/recordService.js';
import req from "express/lib/request.js";
import res from "express/lib/response.js";





export async function get(req, res) {
    if (!!req.query?.name) {
        const result = await recordService.getRecordsBySearch(req.query.search);
        if (result) {
           return res.status(200).json(result);
        }
        return res.status(404).end();
    }
    return res.status(200).json(await recordService.getAllRecords());
}


export async function getById(req, res) {
    try {
        const result = await recordService.getRecordById(req.params.id);
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
    const recordData = req.body;
    try {
        const createdRecord = await recordService.createRecord(recordData);
        res.status(201).json(createdRecord);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function update(req, res) {
    const recordData = req.body;
    try {
        const updatedRecord = await recordService.updateRecord(req.params.id, recordData);
        if (updatedRecord.matchedCount === 0) {
            res.status(404).end();
        }
        return res.status(200).json(updatedRecord);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function deleteRecord(req, res) {
    try {
        const result = await recordService.deleteRecord(req.params.id);
        if (result.matchedCount === 0) {
            res.status(404).end();
        }
        return res.status(200).end();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
