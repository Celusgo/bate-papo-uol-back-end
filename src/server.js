import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let messages = [];

app.post("/participants", (req, res) => {
    const user = req.body;
    if(user.name.length === 0){
        res.sendStatus(400);
    }
    else{
        user.lastStatus = Date.now();
        users.push(user);
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

app.get("/participants", (req, res) => {
    res.send(users);
});

app.post("/messages", (req, res) => {
    const incomingMessage = req.body;
    const sender = req.headers;
    if(incomingMessage.to.length === 0 || incomingMessage.text.length === 0 || (incomingMessage.type !== 'message' && incomingMessage.type !== 'private_message') || sender.user.length === 0){
        res.sendStatus(400);
    }
    else{
        incomingMessage.from = sender.user;
        incomingMessage.time = dayjs(Date.now()).format('HH:mm:ss');
        messages.push(incomingMessage);
        res.sendStatus(200);
    }
});

app.get("/messages", (req, res) => {
    let limit = parseInt(req.query.limit);
    const user = req.headers;
    const thisUserMessages = messages.filter(each => (each.type === 'private_message' && (each.from === user.user || each.to === user.user) || each.type === 'message' || each.type === 'status'));
    if(limit && thisUserMessages.length >=50){
        res.send(thisUserMessages.slice((thisUserMessages.length - limit), (thisUserMessages.length)));
    }
    else{
        res.send(thisUserMessages);
    }        
});

app.listen(4000);