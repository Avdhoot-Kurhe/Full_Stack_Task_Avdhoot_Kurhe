"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const body_parser_1 = __importDefault(require("body-parser"));
const mqtt_1 = __importDefault(require("mqtt"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
// Initialize Express  
const app = express();
const PORT = 5000;
// Middleware  
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// MongoDB Connection  
mongoose_1.default.connect('mongodb+srv://avdhoot:avdhoot123@cluster0.iuloze3.mongodb.net/test/')
    .then(() => {
    console.log('MongoDB connected successfully');
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
const taskSchema = new mongoose_1.default.Schema({
    tasks: [String],
});
const TaskModel = mongoose_1.default.model('assignment_Avdhoot', taskSchema);
// MQTT Client  
const mqttClient = mqtt_1.default.connect('mqtt://broker.hivemq.com');
mqttClient.on('connect', () => {
    mqttClient.subscribe('/add', (err) => {
        if (err)
            console.error('Subscription error:', err);
    });
});
// Add Task API  
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task } = req.body;
    if (!task) {
        return res.status(400).send('Task content is missing');
    }
    try {
        const newTask = new TaskModel({ tasks: [task] });
        yield newTask.save();
        res.status(200).send('Task added successfully');
    }
    catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send('Internal Server Error');
    }
}));
// MQTT Message Handling  
mqttClient.on('message', (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (topic === '/add') {
        const task = message.toString();
        try {
            let taskDoc = yield TaskModel.findOne({});
            if (!taskDoc) {
                taskDoc = new TaskModel({ tasks: [] });
            }
            taskDoc.tasks.push(task);
            if (taskDoc.tasks.length > 50) {
                taskDoc.tasks = taskDoc.tasks.slice(-50);
            }
            yield taskDoc.save();
        }
        catch (err) {
            console.error('Error handling message:', err);
        }
    }
}));
// Fetch All Tasks API  
app.get('/fetchAllTasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield TaskModel.find({});
        const taskList = tasks
            .filter(taskDoc => taskDoc && taskDoc.tasks)
            .map(taskDoc => ({
            id: taskDoc._id,
            task: taskDoc.tasks
        }));
        return res.json(taskList);
    }
    catch (err) {
        console.error('MongoDB fetch error:', err);
        return res.status(500).send('Internal Server Error');
    }
}));
// Start the server  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Graceful shutdown  
process.on('SIGINT', () => {
    console.log('Server is shutting down.');
    process.exit(0);
});
