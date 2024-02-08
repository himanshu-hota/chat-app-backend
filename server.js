// lib import
import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
// import path from 'path';
import cors from 'cors';

// routes import
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

// db connection import
import { connectToMongoDB } from "./db/connectToMongoDB.js";

// socket 
import { app, server } from './socket/socket.js';

// express establishment
// const app = express();
const port = process.env.PORT || 5000;

dotenv.config(); // to get accesst o env variables
app.use(express.json()); // to parse json payload from req.body.


const corsOptions = {
    origin: 'https://quickchats.vercel.app',
}

app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Server is working');
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


// default route
app.use('*', (req, res, next) => {
    return res.status(404).json({ message: 'You reached the space station!!!' });
})

// Error-handling middleware
app.use((err, req, res, next) => {

    return res.status(500).send('Something went wrong!');

});

server.listen(port, () => {
    try {
        connectToMongoDB();
    } catch (err) {
        res.status(500).send('Something went wrong!');
    }
})