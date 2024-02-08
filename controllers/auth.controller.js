import bcrypt from 'bcryptjs';

import User from "../models/User.model.js";
import generateJWETtoken from '../utils/generateToken.js';


export const signup = async (req, res) => {

    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password didn't match" });
        }

        // Check if user already exists
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "User already exists with this username" });
        }

        // GET AVATAR
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE USER
        const newUser = await User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            // Generate JWT Token here
            const token = await generateJWETtoken(newUser._id.toString(), res);

            // SAVE IN DB
            await newUser.save();

            // send response
            return res.status(201).json({
                _id: newUser._id.toString(),
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
                username: newUser.username,
                gender: user?.gender,
                createdAt: user?.createdAt,
                token
            });


        } else {
            // send response
            return res.status(400).json({
                error: "Invalid user data"
            });
        }


    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }



}


export const login = async (req, res) => {

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!isPasswordCorrect || !user) return res.status(400).json({ message: "Invalid credentials" });

        const token = await generateJWETtoken(user?._id.toString(), res);

        return res.status(200).json({
            _id: user?._id.toString(),
            fullName: user?.fullName,
            profilePic: user?.profilePic,
            username: user?.username,
            gender: user?.gender,
            createdAt: user?.createdAt,
            token
        })


    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }

}

export const logout = (req, res) => {
    try {

        res.cookie('jwt', '', { maxAge: 0 });
        return res.status(200).json({ message: "Logout successful" })

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

