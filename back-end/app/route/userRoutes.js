import express from 'express';
import * as userController from '../controller/userController.js';


const router = express.Router();

// handles ?name=foo queries ?email=foo@bar.com
router.get('/', userController.get)

router.get('/:id', userController.getById)

router.post("/", userController.create)

router.put("/:id", userController.update)

router.delete("/:id", userController.deleteUser)


export default router;