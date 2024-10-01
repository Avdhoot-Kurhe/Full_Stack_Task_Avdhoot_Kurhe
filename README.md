# Full Stack Task - To-Do List Application  

## Overview  
This project implements a basic to-do list application using Node.js, MongoDB, and a frontend framework (React.js). The application allows users to add tasks via MQTT 

## Features  
- Add new items to the to-do list by sending a message to the `/add` topic of the MQTT Broker 
- Store tasks as a stringified array in Redis with the key `FULLSTACK_TASK_Avdhoot`.  
- Automatically move tasks to a MongoDB collection when the count exceeds 50 and flush them from Redis.  
- Retrieve all tasks through the `/fetchAllTasks` HTTP API endpoint.  
- Responsive design that fits tablet and mobile screens.  

## Technologies Used  
- **Backend:**  
  - Node.js  
  - TypeScript 
  - MongoDB  
  - MQTT
  
- **Frontend:**  
  - React.js 
  - CSS

## Setup Instructions  
open the 2 terminal one for the backend and one for the frontend
### Backend run commands:
- cd fullstack-task-backend
- npm install
- npm run dev
### Frontend run commands:
- cd fullstack_task_avdhoot
- npm install
- npm start

### Prerequisites  
- Node.js  
- MongoDB account : change this "mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment" url to your MongoDB url and database name
