import express from 'express';
import * as audioController from '../controller/audioController.js';


const router = express.Router();

/*
* body = {"filePath" : <path>} <path> is the one inside the tracklist
* */

router.get("/", audioController.getTrack)

export default router;