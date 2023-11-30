import jobModel from '../models/job.model.js';

class JobController {
    static async createJob(req, res, next) {
        const { company, position} = req.body;
        if(!company || !position) {
            next('Please provide all required fields');
            return;
        }

        req.body.createdBy = req.user.userId;

        const job = await jobModel.create(req.body);

        res.status(201).json({
            job,
        });
    }

    static async getJobs(req, res) {
        const jobs = await jobModel.find({
            createdBy: req.user.userId,
        });

        res.status(200).json({
            totalJobs: jobs.length,
            jobs,
        });
    }
}

export default JobController;
