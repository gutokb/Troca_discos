import req from "express/lib/request.js";
import * as fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export async function getTrack(req, res) {
    const filePath = path.join(__dirname, '../uploads/audio', req.params.fileName);
    console.log(filePath);
    if (!filePath) {
        return res.status(400).json({})
    }
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Audio file not found' });
    }
    res.setHeader('Content-Type', 'audio/mpeg'); // or audio/wav, audio/ogg, etc.
    res.setHeader('Accept-Ranges', 'bytes'); // Enable range requests for seeking
    res.sendFile(filePath);
}