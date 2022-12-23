import { model , Document , Schema } from 'mongoose';

// Criar interface para banco de dados
export interface Candle extends Document{
    low: number;
    high: number;
    open: number;
    close: number;
    color: string;
    finalDateTime: Date;
    currency: string;
};

// Criar schema do banco de dados com base na interface
const schema = new Schema<Candle>({
    low: {
        type: Number,
        required: true,
    },
    high: {
        type: Number,
        required: true,
    },
    open: {
        type: Number,
        required: true,
    },
    close: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    finalDateTime: {
        type: Date,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
})

// Criação do Model Candle com base no schema
export const CandleModel = model<Candle>('Candle', schema);