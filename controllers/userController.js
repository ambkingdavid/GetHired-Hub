import userModel from "../models/user.model.js";

class UserController {
    static async updateUser(req, res, next) {
        const { firstName, lastName, email, location } = req.body;

        if (!firstName, !email, !lastName, !location) {
            next('Please provide all required fields');
            return;
        }

        const user = await userModel.findOne({ _id: req.user.userId });

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.location = location;

        await user.save();

        const token = user.createJWT();

        user.password = undefined;

        res.status(200).json({
            user,
            token,
        })
    }
}

export default UserController;
