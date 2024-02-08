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

// const __dirname = path.resolve();

const corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions));
app.use(express.json()); // to parse json payload from req.body.
app.use(cookieParser()); // to parse the incoming cookie.

// app.get('/', (req, res) => {
//     res.send('Server is working');
// });

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// serve static files
// app.use(express.static(path.join(__dirname, '/frontend/dist')));
// app.use(express.static(path.join(__dirname, '/frontend/public')));

// default route
app.use('*', (req, res, next) => {
    // res.sendFile(path.join((__dirname, "frontend", "dist", "index.html")));
    return res.status(404).json({ message: 'You reached the space station!!!' });
})

// Error-handling middleware
app.use((err, req, res, next) => {
    // console.error(err.stack);
    return res.status(500).send('Something went wrong!');
    // res.sendFile(path.join((__dirname, "frontend", "public", "404.html")));
    // return res.status(500).json({ message: 'Something went wrong!', error: err });
});

server.listen(port, () => {
    try {
        connectToMongoDB();
        // console.log('Server started at localhost:', port);
    } catch (err) {
        // console.log("Server establishment failed");
        // console.log(err);
        res.status(500).send('Something went wrong!');
    }
})