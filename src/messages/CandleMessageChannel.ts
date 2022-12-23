import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import CandleController from "../controllers/CandleController";
import * as http from 'http';
import { Candle } from "../models/CandleModel";

config();

export default class CandleMessageChannel {

    private channel: Channel;
    private candleController: CandleController;
    private socketIO: Server;

    constructor(server: http.Server) {
        this.candleController = new CandleController();

        this.socketIO = new Server(server, {
            cors: {
                origin: process.env.SOCKET_CLIENT_SERVER,
                methods: [ "GET", "POST" ]
            }
        });

        this.socketIO.on('connection', () => console.log('Web socket connection created'));
    }

    async createMessageChanel() {
        try {
            const connection = await connect(process.env.AMQP_SERVER);
            this.channel = await connection.createChannel();
            this.channel.assertQueue(process.env.QUEUE_NAME);
        } catch (error) {
            console.log('Connection to RabbitMQ failed');
            console.log(error);
        }
    }

    consumeMessages(){
        if(this.channel) {
            // Consome a fila e quando aparece alguma mensagem na fila executa a função de callback
            this.channel.consume(process.env.QUEUE_NAME, async (mensagem) => {
                // Transforma a mensagem consumida em objeto
                const candleObj = JSON.parse(mensagem.content.toString());
                
                console.log('Message received');
                console.log(candleObj);

                // Reconhece que recebeu a mensagem
                this.channel.ack(mensagem); 


                const candle: Candle = candleObj;

                this.candleController.save(candle);
                console.log('Candle saved to database');

                // Envia via web socket a candle para o front end
                this.socketIO.emit(process.env.SOCKET_EVENT_NAME, candle);
                console.log('New candle emited by web socket');            
            });

            console.log('Candle consume started');
        } else {
            console.log('Error connection RabbitMQ');
        }
    }
};