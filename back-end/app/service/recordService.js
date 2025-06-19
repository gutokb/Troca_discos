import {User, Record, Sale} from "../model/models.js"
import * as fs from 'fs/promises';


export async function createRecord(recordData) {
    try{
        const newRecord = new Record(recordData)
        const saved = await newRecord.save();
        return saved;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function getAllRecords() {
    try {
        return await Record.find();
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function getRecordsBySearch(search) {
    const accentMap = {
        'a': '[aáàâãäåāăą]',
        'e': '[eéèêëēĕėęě]',
        'i': '[iíìîïĩīĭįı]',
        'o': '[oóòôõöøōŏő]',
        'u': '[uúùûüũūŭůűų]',
        'c': '[cçćĉċč]',
        'n': '[nñńņňŋ]'
    };
    const searchTerm = search.toLowerCase()
        .split('')
        .map(char => accentMap[char] || char)
        .join('');
    try {
       return await Record.find({
        $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { artist: { $regex: searchTerm, $options: 'i' } },
            { genre: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }
        ]
        });
    }
    catch (err) {
        console.log(err.message);
        return err;
    }
}

export async function getRecordById(id) {
    try {
        return await Record.findById(id);
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function updateRecord(recordId, recordData) {
    try {
        return await Record.updateOne(
            {_id: recordId},
            {...recordData},
            {runValidators: true},
        );
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export async function deleteRecord(recordId) {
    try {
        const record = await getRecordById(recordId);
        for (const track of record.tracklist) {
            await fs.unlink(track.filePath);
        }
        return await Record.findByIdAndDelete(recordId);
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}
