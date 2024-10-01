import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fetchAllTasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to fetch tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Fetched All Task</h1>
      <ul className="task-list">
        {tasks.map(({ task, index }) => (
          <>
            {console.log(task)}
            <li key={index} className="task-item">
              {task}
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
