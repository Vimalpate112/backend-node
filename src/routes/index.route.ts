import express from "express"

const router = express.Router();

import authenticationRoutes from "./auth.route"

router.post('/auth', authenticationRoutes)


export default router