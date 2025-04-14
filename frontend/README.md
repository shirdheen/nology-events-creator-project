## Project Overview

The Events Calendar app is a responsive and accessible calendar application built with React (TypeScript). It allows users to view the calendar by month, week, or day, and interact with dates through a keyboard-accessible modal popup.

### This project demonstrates:

- Component-based architecture in **React + TypeScript**
- Custom **calendar logic** for month, week, and day views
- Fully responsive UI and **SCSS modules**
- Accessibility features including **focus trap in modals**
- State and date logic extracted into reusable **custom hooks**

---

## Live Demo

- **Frontend (Github pages):** https://shirdheen.github.io/nology-events-calendar-project/

---

## Kanban Board

![Kanban board](./src/assets/2025-04-08%20-%2010_19_17%20-%20Nology%20-%20Events%20Calendar%20Project%20_%20Trello.png)

---

## Tech Stack

### Frontend

| Tool/Library                      | Purpose                      |
| --------------------------------- | ---------------------------- |
| React + TypeScript                | Core UI and state management |
| SCSS Modules                      | Component-scoped styling     |
| `useState`, `useEffect`, `useRef` | React hooks used througout   |

---

## Features

### Calendar views

- Month View with grid layout and weekday headers
- Week View showing 7 days with overflow day handling
- Day View with 24-hour timeline

### Modal Interaction

- Click any day to open a modal
- Focus trap and Escape-to-close support
- Responsive styling for mobile screens

### Responsive Design

- Mobile-friendly
- Grid adjusts on smaller breakpoints

### Accessibility

- Focus trap implementation with `Tab/Shift+Tab`

---

## Project Setup

### 1. Clone the repository

```bash
git clone git@github.com:shirdheen/nology-events-calendar-project.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm run dev
```

Runs at `http://localhost:5173`

---

## Key Modules

### useCalendar()

Handles:

- Current date
- **Navigation:** next/previous month, week, day
- Calendar metadata (days, blanks)

### getWeeksDatesWithMeta()

Returns an array of 7 `WeekDate` objects for the week, and flags overflow days.

### getFocusableElements()

Used to implement keyboard focus trap within modal windows.

---

## Testing the Application

Manual tests:

- ✅ Tab/Shift+Tab focus cycling inside modal
- ✅ Escape closes modal
- ✅ Month/week/day view toggles work as expected
- ✅ Current day is highlighted
- ✅ Responsive layout adaptss to mobile screen sizes

---

## Future Enhancements

- Add support for task/event creation inside the modal
- Support for recurring or multi-day eventss
- Integrate with a backend
- Add drag-and-drop rescheduling
- Notifications or reminderss via local storage or push
