import * as mongoose from "mongoose";

mongoose.set('strictQuery', false);

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://admin:password@localhost:27017');
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch(err) {
        console.error(err);
    }
}
