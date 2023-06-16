import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import NodeForm from "./NodeForm";
import NodeList from "./NodeList";
import NodeCard from "./NodeCard";
import { getInitialTasks } from "../helper/constants";

const NodePanel = ({ tasks, setTasks, onDragStart, onDragEnd }) => {
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const inputRef = useRef(null);

  // on text change
  const handleChange = (e) => {
    const { value } = e.target;
    setNewTask((prevState) => (prevState = value));
  };

  // handle submit text
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask === "") return;
    if (!isEditing) {
      const newTaskArr = [
        ...tasks,
        { id: uuidv4(), title: newTask, completed: false },
      ];
      setTasks((prevState) => (prevState = newTaskArr));
      setNewTask("");
      inputRef.current.focus();
    } else {
      const newArr = tasks.slice();
      const indexArr = newArr.map((arr) => arr.id);
      const index = indexArr.indexOf(editId);
      newArr.splice(index, 1, { id: editId, title: newTask, completed: false });
      setTasks((prevState) => (prevState = newArr));
      setNewTask("");
      setEditId("");
      setIsEditing(false);
      inputRef.current.focus();
    }
  };

  // hande clear text
  const handleClear = () => {
    setTasks([]);
    inputRef.current.focus();
  };

  // cancel your text node
  const handleCancel = () => {
    setIsEditing(false);
    setNewTask("");
    setEditId("");
    inputRef.current.focus();
  };

  // handle delete text node
  const handleDelete = (id) => {
    setTasks((prevState) => prevState.filter((task) => task.id !== id));
  };

  // handle edit text node
  const handleEdit = (id) => {
    const item = tasks.find((task) => task.id === id);
    setNewTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
    inputRef.current.focus();
  };

  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== undefined) {
        localStorage.setItem("Tasks", JSON.stringify([...tasks]));
      }
    }, 50);
  }, [tasks]);

  useEffect(() => {
    inputRef.current.focus();
    setTasks(getInitialTasks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Task list
  const TaskLists = () =>
    tasks.map((task, index) => {
      return (
        <React.Fragment key={index}>
          <NodeCard
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </React.Fragment>
      );
    });

  return (
    <div className="TodoApp flex flex-col justify-between max-h-[80vh] h-full">
      <div className="todoapp_child">
        <NodeForm
          onSubmit={handleSubmit}
          value={newTask}
          onChange={handleChange}
          onClick={!isEditing ? handleClear : handleCancel}
          isEditing={isEditing}
          reference={inputRef}
        />
        {tasks && tasks.length > 0 ? (
          <NodeList>
            <TaskLists />
          </NodeList>
        ) : (
          <span className="no-task">
            <i className="fas fa-tasks" />
            <span className="no-task-p">Add message here</span>
          </span>
        )}
      </div>

      <p className="text-center">Drag and drop your text node to flow diagram</p>
    </div>
  );
};

export default NodePanel;
