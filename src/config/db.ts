import { config } from 'dotenv';
import { connect , set } from 'mongoose';

export const connectMongoDB =async () => {
    config();
    await set("strictQuery", true);
    await connect(process.env.MONGODB_CONNECTION_URL);
}