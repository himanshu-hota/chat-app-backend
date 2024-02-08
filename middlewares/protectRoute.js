import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const protectRoute = async (req, res, next) => {

    try {

        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            // No Authorization header present, handle accordingly
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }
        const token = authorizationHeader.split(' ')[1];

        const JWT_KEY = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_KEY);

        if (!decoded) return res.status(401).json({ error: "Unauthorized - Invalid Token" });

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) return res.status(401).json({ error: "No user found" });

        req.user = user;

        next();
    } catch (err) {
        next(err);
    }

}

export default protectRoute;