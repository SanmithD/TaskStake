import mongoose from 'mongoose';

export const dbConnect = async() =>{
    try {
        const response = await mongoose.connect(process.env.MONGO);
        console.log(response.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}