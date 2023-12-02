import { Router } from 'express';

import userAuth from '../middlewares/authentication.js';
import JobController from '../controllers/jobController.js';

const router = Router();

// CREATE JOB - POST
router.post('/create-job', userAuth, JobController.createJob);

// GET JOBS - GET
router.get('/get-jobs', userAuth, JobController.getJobs);

//UPDATE JOBS - PATCH
router.patch("/update-job/:id", userAuth, JobController.updateJobs);

//DELETE JOBS - DELETE
router.delete("/delete-job/:id", userAuth, JobController.deleteJob);

// JOBS STATS FILTER - GET
router.get("/job-stats", userAuth, JobController.jobStats);

export default router;
