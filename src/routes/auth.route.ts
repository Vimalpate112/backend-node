import express from 'express';
import { login, logout, verifyEmail } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const authenticationRoutes = express.Router();

authenticationRoutes.post('/login', login)
authenticationRoutes.post('/logout', verifyToken, logout)
authenticationRoutes.post('/verify-email', verifyToken, verifyEmail)


export default authenticationRoutes;