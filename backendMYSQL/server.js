const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default
  database: "smart_planner",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});


// 🟢 GET all tasks
app.get("/tasks", (req, res) => {
  // Fetch all tasks from MySQL
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// 🔵 POST create new task
app.post("/tasks", (req, res) => {
  // Destructure new fields from the request body
  const { title, description, status, category, priority, due_date } = req.body;

  // ✅ Validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Valid title is required",
    });
  }

  const query = `
    INSERT INTO tasks (title, description, status, category, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      title.trim(), 
      description || null, 
      status || "pending", 
      category || "General", 
      priority || "medium", 
      due_date || null
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to create task",
        });
      }

      res.status(201).json({
        success: true,
        data: { id: result.insertId, ...req.body },
      });
    }
  );
});


// 🟡 PUT update task
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, status, category, priority, due_date } = req.body;

  // ✅ ID validation
  if (isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  // Check if task exists
  db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const existing = results[0];

    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDescription =
      description !== undefined ? description : existing.description;
    const updatedStatus =
      status !== undefined ? status : existing.status; // Ensure status is updated
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedPriority = priority !== undefined ? priority : existing.priority;
    const updatedDueDate = due_date !== undefined ? due_date : existing.due_date;

    const updateQuery = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?, category = ?, priority = ?, due_date = ?
      WHERE id = ?
    `;

    db.query(
      updateQuery,
      [updatedTitle, updatedDescription, updatedStatus, updatedCategory, updatedPriority, updatedDueDate, taskId],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Update failed",
          });
        }

        res.status(200).json({
          success: true,
          data: {
            id: taskId,
            title: updatedTitle,
            description: updatedDescription,
            status: updatedStatus,
          },
        });
      }
    );
  });
});

// 🟠 TIME BLOCK ROUTES

// Get all time block assignments
app.get("/time-blocks", (req, res) => {
  db.query("SELECT * FROM time_block_assignments", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.status(200).json({ success: true, data: results });
  });
});

// Add task to a time slot
app.post("/time-blocks", (req, res) => {
  const { task_id, time_slot } = req.body;

  // Step 1: Remove task from any existing slots first to prevent duplicates
  db.query("DELETE FROM time_block_assignments WHERE task_id = ?", [task_id], (err) => {
    if (err) return res.status(500).json({ success: false });

    // Step 2: Insert into the new time slot
    const query = "INSERT INTO time_block_assignments (task_id, time_slot, assignment_date) VALUES (?, ?, CURDATE())";
    db.query(query, [task_id, time_slot], (err) => {
      if (err) return res.status(500).json({ success: false });
      res.status(201).json({ success: true });
    });
  });
});

// Remove task from a time slot
app.delete("/time-blocks/:taskId", (req, res) => {
  db.query("DELETE FROM time_block_assignments WHERE task_id = ?", [req.params.taskId], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.status(200).json({ success: true });
  });
});

// 🔴 DELETE task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Delete failed",
        });
      }

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    });
  });
});


// 🟣 Root route
app.get("/", (req, res) => {
  res.send("Smart Planner API with MySQL is running 🚀");
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});