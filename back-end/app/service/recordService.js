import {User, Record, Sale} from "../model/models.js"



export async function createRecord(recordData) {
    try{
        const newRecord = new Record(recordData);
        await newRecord.save();
        return newRecord;
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
        return await User.updateOne(
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
        return await User.findByIdAndDelete(userId);
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}
