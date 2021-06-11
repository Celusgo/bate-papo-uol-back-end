import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

let participants = [];
let messages = [];

app.post("/participants", (req, res) => {
    const user = req.body;
    if(user.name.length === 0){
        res.sendStatus(400);
    }
    else{
        user.lastStatus = Date.now();
        participants.push(user);
        const success = {
            from: user.name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs(user.lastStatus).format('HH:mm:ss')
        }
        messages.push(success);
        res.sendStatus(200);
    }
});