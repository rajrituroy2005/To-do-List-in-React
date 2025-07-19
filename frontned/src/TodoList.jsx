import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem('react-todo-tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
      return [];
    }
  });

  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('react-todo-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage:", error);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id, currentText) => {
    setEditingTaskId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editingText } : task
    ));
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  return (
    <div className="todo-container">
      <h1>My Daily Tasks</h1>

      <div className="task-input-section">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <p className="no-tasks-message">No tasks yet. Start adding some!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              {editingTaskId === task.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleSaveEdit(task.id); }}
                  />
                  <button className="save-button" onClick={() => handleSaveEdit(task.id)}>Save</button>
                  <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <span
                    className="task-text"
                    onClick={() => handleToggleComplete(task.id)}
                  >
                    {task.text}
                  </span>
                  <div className="task-actions">
                    <button onClick={() => handleEditTask(task.id, task.text)}>
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)}>
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;