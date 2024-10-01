import express,{ Request, Response } from 'express';
import bodyParser from 'body-parser';
import mqtt from 'mqtt';
import mongoose from 'mongoose';
import cors from 'cors';
// Initialize Express
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


interface ITask {
  _id?: string;
  tasks: string; 
}

const taskSchema = new mongoose.Schema<ITask>({
  tasks: { type: String, required: true }, 
});


const TaskModel = mongoose.model<ITask>('assignment_Avdhoot', taskSchema);

// MQTT Client
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
  mqttClient.subscribe('/add', (err) => {
    if (err) console.error('Subscription error:', err);
  });
});

// Add Task API
app.post('/add', async (req: Request, res: Response) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).send('Task content is missing');
  }

  try {
    const newTask = new TaskModel({ tasks: task });
    await newTask.save();
    res.status(200).send('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});


mqttClient.on('message', async (topic, message) => {
  if (topic === '/add') {
    const task = message.toString();
    try {
      let taskDoc = await TaskModel.findOne({});
      if (!taskDoc) {
        taskDoc = new TaskModel({ tasks: task });
      } else {
        taskDoc.tasks = task; 
      }

      await taskDoc.save();
    } catch (err) {
      console.error('Error handling message:', err);
    }
  }
});


app.get('/fetchAllTasks', async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find({});
    const taskList = tasks.map(taskDoc => ({
      id: taskDoc._id,
      task: taskDoc.tasks
    }));

    return res.json(taskList);
  } catch (err) {
    console.error('MongoDB fetch error:', err);
    return res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


process.on('SIGINT', () => {
  console.log('Server is shutting down.');
  process.exit(0);
});
