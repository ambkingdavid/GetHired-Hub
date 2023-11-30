import { Router } from 'express';

import userAuth from '../middlewares/authentication.js';
import JobController from '../controllers/jobController.js';

const router = Router();

// CREATE JOB - POST
router.post('/create-job', userAuth, JobController.createJob);

// GET JOBS - GET
router.get('/get-jobs', userAuth, JobController.getJobs);

export default router;
