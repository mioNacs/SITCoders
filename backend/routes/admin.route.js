

import { Router } from 'express';

const router = Router();

import { createAdmin } from '../controllers/admin.controller.js';

router.post('/create', createAdmin);

export default router;