import User from "../models/User.model.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

        return res.status(201).json(filteredUsers);


    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
    }
}