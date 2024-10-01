import React, { useState } from 'react';  
import axios from 'axios';  

const TaskInput = () => {  
    const [task, setTask] = useState('');  

    const handleAddTask = async () => {  
        try {  
            if (task) {  
                await axios.post('http://localhost:5000/add', { task });  
                setTask('');  
                window.location.reload();
            }  
        } catch (error) {  
            console.error('Error adding task:', error);  
            alert('Failed to add task. Please try again.');  
        }  
    };  

    return (  
        <div className="task-input">  
            <input  
                type="text"  
                value={task}  
                onChange={(e) => setTask(e.target.value)}  
                placeholder="Add a new task"  
                className="input"  
            />  
            <button onClick={handleAddTask} className="add-button">Add Task</button>  
        </div>  
    );  
};  

export default TaskInput;