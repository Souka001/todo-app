import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import verified from "../assets/img/verified.png";
import write from "../assets/img/write.png";
import bin from "../assets/img/bin.png";

function ToDoPage() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Track task being edited
  const [showModal, setShowModal] = useState(false); // For delete confirmation
  const [taskToDelete, setTaskToDelete] = useState(null); // Task to delete

  // Add a new task
  const handleAddTask = async () => {
    if (task.trim()) {
      setIsLoading(true);
      try {
        await addDoc(collection(db, "tasks"), {
          text: task,
          completed: false,
          confirmed: null,
        });
        setTask("");
        fetchTasks();
      } catch (error) {
        console.error("Error adding task: ", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Task cannot be empty!");
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksList);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, { completed: !taskToUpdate.completed });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling complete: ", error);
    }
  };

  // Confirm a task
  const handleConfirmTask = async (id) => {
    try {
      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, { confirmed: true });
      fetchTasks();
    } catch (error) {
      console.error("Error confirming task: ", error);
    }
  };

  // Edit a task
  const handleEditTask = (task) => {
    setEditingTask(task); // Set the task being edited
    setTask(task.text); // Populate the input with the current task text
  };

  // Update a task
  const handleUpdateTask = async () => {
    if (editingTask) {
      try {
        const taskDocRef = doc(db, "tasks", editingTask.id);
        await updateDoc(taskDocRef, { text: task });
        setEditingTask(null);
        setTask("");
        fetchTasks();
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowModal(true);
  };

  // Confirm and delete a task
  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const taskDocRef = doc(db, "tasks", taskToDelete.id);
        await deleteDoc(taskDocRef);
        setTaskToDelete(null);
        setShowModal(false);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container>
      <Row className="align-items-center">
        <Col xs={12} md={6}>
          <div>
            <h1>Manage Your Tasks</h1>
            <Form.Control
              type="text"
              placeholder="Enter your task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="mb-3"
            />
            {editingTask ? (
              <Button variant="warning" onClick={handleUpdateTask}>
                Update Task
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleAddTask}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Task"}
              </Button>
            )}

            <div className="task-list mt-4">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`task-item ${t.completed ? "completed" : ""}`}
                >
                  <span
                    onClick={() => handleToggleComplete(t.id)}
                    style={{
                      textDecoration: t.completed ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                  >
                    {t.text}
                  </span>
                  {t.confirmed === null && (
                    <div className="mt-3 task-icons">
                      <img
                        src={verified}
                        alt="Confirm"
                        onClick={() => handleConfirmTask(t.id)}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <img
                        src={write}
                        alt="Edit Task"
                        onClick={() => handleEditTask(t)}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <img
                        src={bin}
                        alt="Delete Task"
                        onClick={() => handleOpenDeleteModal(t)} 
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    </div>
                  )}

                  {t.confirmed !== null && (
                    <div className="mt-3 task-icons">
                      <span
                        className={t.confirmed ? "text-success" : "text-danger"}
                      >
                        {t.confirmed ? "Confirmed" : "Discarded"}
                      </span>
                      <img
                        src={bin}
                        alt="Delete Task"
                        onClick={() => handleOpenDeleteModal(t)} 
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ToDoPage;
