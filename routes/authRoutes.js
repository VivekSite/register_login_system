import express from 'express';
import { registerController, loginController, resetPasswordController} from '../controllers/authControllers.js';

//––––––––––––––––––––––– Router Object –––––––––––––––––––––––
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/reset-password', resetPasswordController);

export default router;