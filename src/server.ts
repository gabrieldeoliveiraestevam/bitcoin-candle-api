import { config } from 'dotenv';
import { connection } from 'mongoose';
import { app } from './app';
import { connectMongoDB } from './config/db';
import CandleMessageChannel from './messages/CandleMessageChannel';

const createServer = async () => {
    config();
    console.log('Initial')
    await connectMongoDB();
    const PORT = process.env.PORT;
    const server = app.listen(PORT, () => console.log(`App running on port ${PORT}`));

    // cosume ficara executando sempre ouvindo a fila
    const candleMessageChannel = new CandleMessageChannel(server);
    await candleMessageChannel.createMessageChanel();
    candleMessageChannel.consumeMessages();

    // Caso o processo seja interrompido, encerra as conecções 
    process.on('SIGINT', async () => {
        await connection.close();   
        server.close();
        console.log('App server and connection to MongoDB closed');
    })
}
