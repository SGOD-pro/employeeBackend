import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ReactEmployee')
        console.log("Mongo is connected");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default connectDB;