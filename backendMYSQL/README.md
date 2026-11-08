# 🚀 Smart Planner API (MySQL Version)

A robust RESTful API built with Node.js and Express, utilizing a MySQL database for persistent storage to power the Smart Daily Planner application.

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the API.
- **MySQL**: Relational database for persistent task and user data.

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- **MySQL Server**: Installed and running locally or on a remote host.

### Installation
1. Navigate to the backend directory:
   ```bash
   cd "backend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup
1. Create a MySQL database named `smart_planner`.
2. Configure your connection details in a `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=smart_planner
   PORT=5000
   ```

### Running the Server
Start the server on `http://localhost:5000`:
```bash
node server.js
```

## 📡 API Endpoints

| Method | Endpoint      | Description             |
| :----- | :------------ | :---------------------- |
| `GET`  | `/`           | Health check            |
| `GET`  | `/tasks`      | Retrieve all tasks      |
| `POST` | `/tasks`      | Create a new task       |
| `PUT`  | `/tasks/:id`  | Update an existing task |
| `DELETE` | `/tasks/:id`| Remove a task           |

### Data Models

**Task Object:**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "completed": false
}
```

## 📝 Notes
- The server uses `express.json()` middleware to parse incoming request bodies.
- Validation is included for the `POST /tasks` endpoint to ensure a `title` is provided.