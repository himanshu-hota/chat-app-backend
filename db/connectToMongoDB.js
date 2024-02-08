import mongoose from 'mongoose';

let isConnected = false;
let mongoConnection;

export const connectToMongoDB = async () => {
    if (isConnected) {
        console.log('Already connected to MongoDB');
        return mongoConnection;
    }

    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        isConnected = true;
        mongoConnection = mongoose.connection;
        // console.log('Connected to MongoDB');
        return mongoConnection;
    } catch (err) {
        // console.error('MongoDB connection failed!!!');
        // console.error(err);
        // throw err; // rethrow the error to handle it in the calling function
    }
};
