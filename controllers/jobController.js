import jobModel from '../models/job.model.js';

class JobController {
    static async createJob(req, res, next) {
        const { company, position } = req.body;
        if (!company || !position) {
            next('Please provide all required fields');
            return;
        }

        console.log(req.user.userId);

        req.body.createdBy = req.user.userId;

        const job = await jobModel.create(req.body);

        res.status(201).json({
            job,
        });
    }

    static async getJobs(req, res) {
        const { status, workType, search, sort } = req.query;
        //conditons for searching filters
        const queryObject = {
            createdBy: req.user.userId,
        };
        //logic filters
        if (status && status !== "all") {
            queryObject.status = status;
        }
        if (workType && workType !== "all") {
            queryObject.workType = workType;
        }
        if (search) {
            queryObject.position = { $regex: search, $options: "i" };
        }

        let queryResult = jobModel.find(queryObject);

        //sorting
        if (sort === "latest") {
            queryResult = queryResult.sort("-createdAt");
        }
        if (sort === "oldest") {
            queryResult = queryResult.sort("createdAt");
        }
        if (sort === "a-z") {
            queryResult = queryResult.sort("position");
        }
        if (sort === "z-a") {
            queryResult = queryResult.sort("-position");
        }
        //pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        queryResult = queryResult.skip(skip).limit(limit);
        //jobs count
        const totalJobs = await jobModel.countDocuments(queryResult);
        const numOfPage = Math.ceil(totalJobs / limit);

        const jobs = await queryResult;

        // const jobs = await jobsModel.find({ createdBy: req.user.userId });
        res.status(200).json({
            totalJobs,
            jobs,
            numOfPage,
        });
    }

    static async updateJobs(req, res, next) {
        const { id } = req.params;
        const { company, position } = req.body;

        if (!company || !position) {
            next("Please Provide Required Fields");
        }

        const job = await jobModel.findOne({ _id: id });
        console.log(id)

        if (!job) {
            next(`no jobs found with this id ${id}`);
        }
        if (!req.user.userId === job.createdBy.toString()) {
            next("Unauthorized");
            return;
        }
        const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ updateJob });
    }

    static async deleteJob(req, res, next) {
        const { id } = req.params;

        const job = await jobModel.findOne({ _id: id });

        if (!job) {
            next(`No Job Found With This ID ${id}`);
        }
        if (!req.user.userId === job.createdBy.toString()) {
            next("Unauthorized");
            return;
        }
        await job.deleteOne();
        res.status(200).json({ message: "Job Deleted Successfully" });
    }

    static async jobStats(req, res, next) {
        const stats = await jobModel.aggregate([
            // search by user jobs
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.userId),
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);


        const defaultStats = {
            pending: stats.pending || 0,
            reject: stats.reject || 0,
            interview: stats.interview || 0,
        };

        //monthly yearly stats
        let monthlyApplication = await jobsModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.userId),
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        monthlyApplication = monthlyApplication
            .map((item) => {
                const {
                    _id: { year, month },
                    count,
                } = item;
                const date = moment()
                    .month(month - 1)
                    .year(year)
                    .format("MMM Y");
                return { date, count };
            })
            .reverse();
        res
            .status(200)
            .json({ totlaJob: stats.length, defaultStats, monthlyApplication });
    }
}

export default JobController;
