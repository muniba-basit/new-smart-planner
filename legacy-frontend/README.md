# 📅 Smart Daily Planner 2025

A sophisticated, high-performance web application designed for modern productivity. This frontend provides an intuitive interface for managing daily tasks, visualizing schedules through a calendar, tracking productivity via analytics, and organizing the day with time-blocking.

## ✨ Features

### 📝 Task Management
- **Smart Entry**: Add tasks with priority levels (High, Medium, Low) and categories (Work, Personal, Health, General).
- **Filtering & Sorting**: Filter tasks by status and sort them to focus on what matters most.
- **Interactive List**: Custom-styled task items with priority indicators and completion toggles.

### 🗓️ Advanced Views
- **Calendar View**: A fully interactive grid to manage tasks by date, featuring "Today" highlighting and task previews.
- **Time Blocking**: A dedicated interface to drag and drop tasks into specific hour slots for optimized scheduling.
- **Analytics Dashboard**: Visual progress tracking with CSS-animated progress bars and "Big Number" stats for streaks and completion rates.

### 🎨 UI/UX Excellence
- **Dual Theme Support**: Seamless switching between a refined "Mocha" light mode and a deep "Charcoal" dark mode.
- **Responsive Design**: Mobile-first approach with a sliding hamburger sidebar and flexible grids.
- **Micro-interactions**: Smooth transitions, hover effects, and "fade-up" animations for a premium feel.

## 🛠️ Technology Stack

- **HTML5**: Semantic structure.
- **CSS3**: Custom properties (variables), Grid, Flexbox, and sophisticated animations.
- **JavaScript (ES6+)**: Logic for view switching, task CRUD, and theme toggling.
- **Typography**: 'DM Sans' for readability and 'Playfair Display' for an elegant editorial look.

## 🚀 Getting Started

### Prerequisites
This frontend is designed to communicate with the [Smart Planner Backend](../backend/server.js). Ensure your backend server is running on `http://localhost:5000`.

### Installation
1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Open `index.html` directly in your browser or use a Live Server extension in your IDE.

## 📂 Project Structure

```text
frontend/
├── index.html      # Main application structure
├── style.css       # Design system and layout
├── script.js      # Frontend logic (View switching, API calls)
└── assets/         # Icons and images
```

## 🎨 Design System

The app uses a custom CSS variable system defined in `:root`:
- **Mocha (`#A38A75`)**: The primary brand color.
- **Blue (`#8FAFC5`)**: Used for secondary actions and calendar headers.
- **Green (`#7FB3A8`)**: Success states and low-priority tasks.
- **Gold (`#C9A84C`)**: Streaks and medium-priority tasks.

## 📱 Responsive Breakpoints
- **Desktop (1024px+)**: Sidebar is pinned to the left; full layout visibility.
- **Mobile (< 600px)**: Compact forms, single-column analytics, and sliding mobile navigation.

---
*Created with ❤️ for DecodeLabs*