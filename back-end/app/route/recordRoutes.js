import express from 'express';
import * as recordController from '../controller/recordController.js';


const router = express.Router();

// handles ?name=foo queries ?email=foo@bar.com
router.get('/', recordController.get)

router.get('/:id', recordController.getById)

router.post("/", recordrController.create)

router.put("/:id", recordController.update)

router.delete("/:id", recordController.deleteRecord)


export default router;