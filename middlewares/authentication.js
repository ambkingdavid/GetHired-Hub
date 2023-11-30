import JWT from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        next('Unauthorized');
    }

    const token = header.split(' ')[1];

    try {
        const result = JWT.verify(token, process.env.JWT_SECRET);
        req.user = { userId: result.userId };
        next();
    } catch (err) {
        next('Unathorized');
    }
}

export default userAuth;
