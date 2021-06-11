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
    if(user.name.length === 0 || users.find((each) => each.name === user.name)){
        res.sendStatus(400);
    }
    else{
        user.lastStatus = Date.now();
        users.push(user);
        const success = {
            from: user.name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(user.lastStatus).format("HH:mm:ss")
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
    if(incomingMessage.to.length === 0 || incomingMessage.text.length === 0 || (incomingMessage.type !== "message" && incomingMessage.type !== "private_message") || sender.user.length === 0){
        res.sendStatus(400);
    }
    else{
        incomingMessage.from = sender.user;
        incomingMessage.time = dayjs(Date.now()).format("HH:mm:ss");
        messages.push(incomingMessage);
        res.sendStatus(200);
    }
});

app.get("/messages", (req, res) => {
    let limit = parseInt(req.query.limit);
    const user = req.headers;
    const thisUserMessages = messages.filter(each => (each.type === "private_message" && (each.from === user.user || each.to === user.user) || each.type === "message" || each.type === "status"));
    (limit && thisUserMessages.length >=50)? (res.send(thisUserMessages.slice((thisUserMessages.length - limit), (thisUserMessages.length)))) : res.send(thisUserMessages);  
});

app.post('/status', (req,res) => {
    const user = req.headers;
    const isStillOnline =  users.find((each) => each.name === user.user);
    isStillOnline ? ((isStillOnline.lastStatus = Date.now()) && res.sendStatus(200)) : res.sendStatus(400);
});

setInterval(() => {
    users = users.filter(each => {
        if((Date.now() - each.lastStatus) < 10000) {
            return true;
        }
        else{
            messages.push({
                from: each.name,
                to: "Todos",
                text: "sai da sala...",
                type: "status",
                time: dayjs().format("HH:mm:ss")
            });
            return false;
        }    
    })
}, 15000);

app.listen(4000);