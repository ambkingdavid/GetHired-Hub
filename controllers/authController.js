import userModel from '../models/user.model.js'

class AuthController {
  static async register(req, res, next) {
    const { name, lastName, email, password } = req.body;

    if (!name) {
      next('Name is required');
    }

    if (!email) {
      next('Email is required');
    }

    if (!password) {
      next('Password is required');
    }

    const result = await userModel.findOne({ email });
    if (result) {
      return res.status(200).send({
        success: false,
        message: 'Email already registered to a user'
      });
    }

    const user = await userModel.create({
      name,
      lastName,
      email,
      password,
    });

    res.status(201).send({
      message: 'User created successfully',
      success: true,
      user,
    })
  }
}

export default AuthController;
