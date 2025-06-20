import express from 'express';
import * as salesController from '../controller/salesController.js';


const router = express.Router();

router.post("/sell/:id", salesController.sell)

export default router;