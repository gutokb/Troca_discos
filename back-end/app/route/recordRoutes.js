import express from 'express';
import * as recordController from '../controller/recordController.js';


const router = express.Router();


router.get('/', recordController.get)

router.get('/:id', recordController.getById)

router.post("/", recordController.create)

router.put("/:id", recordController.update)

router.delete("/:id", recordController.deleteRecord)


export default router;