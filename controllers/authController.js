import userModel from '../models/user.model.js'

class AuthController {
  static async register(req, res, next) {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) {
      next('firstName is required');
    }

    if (!lastName) {
      next('lastName is required');
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
      firstName,
      lastName,
      email,
      password,
    });

    const token = user.createJWT();

    user.password = undefined;

    res.status(201).send({
      message: 'User created successfully',
      success: true,
      user,
      token,
    })
  }

  static async login (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      next('Provide All Fields');
      return;
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      next('Invalid Username');
      return;
    }

    const result = await user.validatePassword(password)

    if (!result) {
      next('Invalid Password');
      return;
    }

    const token = user.createJWT();

    user.password = undefined;

    res.status(200).json({
      message: 'Login Successful',
      success: true,
      user,
      token,
    })
  }
}

export default AuthController;
