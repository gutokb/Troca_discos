import * as recordService from '../service/recordService.js';
import req from "express/lib/request.js";
import res from "express/lib/response.js";
import multer from "multer";
import path from "path";
import * as fs from "fs/promises";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/audio');

        // Ensure directory exists
        try {
            await fs.mkdir(uploadPath, { recursive: true });
        } catch (error) {
            console.error('Error creating upload directory:', error);
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `track-${uniqueSuffix}${ext}`);
    }
});

// File filter to only allow audio files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit per file
        files: 20 // Maximum 20 tracks per album
    }
});


export async function get(req, res) {
    if (!!req.query?.search) {
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

async function cleanupFiles(files) {
    for (const file of files) {
        try {
            await fs.unlink(file.path);
        } catch (error) {
            console.error(`Error deleting file ${file.path}:`, error);
        }
    }
}

async function processTrackFiles(uploadedFiles, tracksMetadata) {
    const processedTracks = [];

    // Sort files by their field name to maintain order
    const sortedFiles = uploadedFiles.sort((a, b) => {
        const aIndex = parseInt(a.fieldname.split('_')[1]);
        const bIndex = parseInt(b.fieldname.split('_')[1]);
        return aIndex - bIndex;
    });

    for (let i = 0; i < sortedFiles.length; i++) {
        const file = sortedFiles[i];
        const trackMetadata = tracksMetadata[i];

        if (!trackMetadata) {
            throw new Error(`Missing metadata for track ${i + 1}`);
        }

        processedTracks.push({
            trackNumber: trackMetadata.trackNumber,
            title: trackMetadata.title,
            filePath: file.path,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            duration: null // Can be populated later with audio analysis
        });
    }

    return processedTracks;
}


export async function create(req, res) {

    try {
        // Use multer middleware to handle multiple files
        const uploadMiddleware = upload.any(); // Accept any field name for files

        uploadMiddleware(req, res, async (uploadError) => {
            if (uploadError) {
                console.error('Upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: `File upload error: ${uploadError.message}`
                });
            }

            try {
                const { title, tracksMetadata } = req.body;

                // Parse tracks metadata
                let tracks;
                try {
                    tracks = JSON.parse(tracksMetadata);
                } catch (parseError) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid tracks metadata format'
                    });
                }

                // Validate that we have uploaded files
                // if (!req.files || req.files.length === 0) {
                //     return res.status(400).json({
                //         success: false,
                //         message: 'No audio files uploaded'
                //     });
                // }

                // Process uploaded files and match with track metadata
                const processedTracks = await processTrackFiles(req.files, tracks);

                // Prepare product data
                const productData = {
                    title : title,
                    tracklist: processedTracks,
                    artist : req.body.artist,
                    year : Number(req.body.year),
                    genre : JSON.parse(req.body.genre),
                    price : Number(req.body.price),
                    stock : Number(req.body.stock),
                    coverImgPath: req.body.coverImgPath,

                };
                const savedProduct = await recordService.createRecord(productData);

                res.status(201).json({
                    success: true,
                    message: 'Product and tracklist created successfully',
                    data: savedProduct
                });

            } catch (error) {
                console.error('Product creation error:', error);

                // Clean up uploaded files if product creation fails
                if (req.files) {
                    await cleanupFiles(req.files);
                }

                res.status(500).json({
                    success: false,
                    message: 'Internal server error during product creation'
                });
            }
        });

    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
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
