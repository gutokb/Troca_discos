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
