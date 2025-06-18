import * as recordService from '../service/recordService.js';
import req from "express/lib/request.js";
import res from "express/lib/response.js";
import multer from "multer";
import path from "path";
import * as fs from "fs/promises";


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
// static async createProduct(req, res) {
//     try {
//         // Use multer middleware to handle multiple files
//         const uploadMiddleware = upload.any(); // Accept any field name for files
//
//         uploadMiddleware(req, res, async (uploadError) => {
//             if (uploadError) {
//                 console.error('Upload error:', uploadError);
//                 return res.status(400).json({
//                     success: false,
//                     message: `File upload error: ${uploadError.message}`
//                 });
//             }
//
//             try {
//                 const { albumName, tracksMetadata } = req.body;
//
//                 // Validate required fields
//                 if (!albumName) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Album name is required'
//                     });
//                 }
//
//                 if (!tracksMetadata) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Tracks metadata is required'
//                     });
//                 }
//
//                 // Parse tracks metadata
//                 let tracks;
//                 try {
//                     tracks = JSON.parse(tracksMetadata);
//                 } catch (parseError) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Invalid tracks metadata format'
//                     });
//                 }
//
//                 // Validate that we have uploaded files
//                 if (!req.files || req.files.length === 0) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'No audio files uploaded'
//                     });
//                 }
//
//                 // Process uploaded files and match with track metadata
//                 const processedTracks = await ProductController.processTrackFiles(req.files, tracks);
//
//                 // Prepare product data
//                 const productData = {
//                     albumName,
//                     tracklist: processedTracks,
//                     // ... other product fields from req.body
//                 };
//
//                 // Save product using service
//                 const savedProduct = await ProductService.createProductWithTracklist(productData);
//
//                 res.status(201).json({
//                     success: true,
//                     message: 'Product and tracklist created successfully',
//                     data: savedProduct
//                 });
//
//             } catch (error) {
//                 console.error('Product creation error:', error);
//
//                 // Clean up uploaded files if product creation fails
//                 if (req.files) {
//                     await ProductController.cleanupFiles(req.files);
//                 }
//
//                 res.status(500).json({
//                     success: false,
//                     message: 'Internal server error during product creation'
//                 });
//             }
//         });
//
//     } catch (error) {
//         console.error('Controller error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// }
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
                const { albumName, tracksMetadata } = req.body;

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
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No audio files uploaded'
                    });
                }

                // Process uploaded files and match with track metadata
                const processedTracks = await ProductController.processTrackFiles(req.files, tracks);

                // Prepare product data
                const productData = {
                    albumName,
                    tracklist: processedTracks,
                    // ... other product fields from req.body
                };

                // Save product using service
                const savedProduct = await ProductService.createProductWithTracklist(productData);

                res.status(201).json({
                    success: true,
                    message: 'Product and tracklist created successfully',
                    data: savedProduct
                });

            } catch (error) {
                console.error('Product creation error:', error);

                // Clean up uploaded files if product creation fails
                if (req.files) {
                    await ProductController.cleanupFiles(req.files);
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
