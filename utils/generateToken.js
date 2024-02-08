import jwt from 'jsonwebtoken';

export const generateJWETtoken = async (userId, res) => {

    const JWT_KEY = process.env.JWT_SECRET;

    const token = jwt.sign({ userId }, JWT_KEY, {
        expiresIn: '15d'
    });

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // milisecond,
        httpOnly: true,// prevent XSS attacks (user cant access it using javascript),
        sameSite: 'strict', // prevent CSRF attacks (Cross-site Request Foregery Attacks)
        secure: process.env.NODE_ENV !== 'development'

    });

    return token;
}

export default generateJWETtoken;