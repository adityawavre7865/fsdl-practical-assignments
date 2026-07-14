# Student Feedback System

## Description

This is a full-stack web application developed using React, Node.js, Express, and MongoDB.

It allows users to:

* Register and login
* Submit feedback
* View feedback based on roles
* Manage feedback entries

---

## Features

* JWT-based authentication system
* Role-based access (Student, Faculty, Admin)
* Student dashboard to submit and view feedback
* Faculty dashboard to view all feedback
* Admin dashboard to delete feedback
* Responsive and modern UI
* Session persistence using localStorage

---

## Tech Stack

* React
* Node.js
* Express.js
* MongoDB
* HTML, CSS, JavaScript

---

## How to Run

1. Clone the repo:

```
git clone https://github.com/SwayamMandhani06/student-feedback-system.git
```

2. Install backend dependencies:

```
cd backend
npm install
```

3. Install frontend dependencies:

```
cd ../frontend
npm install
```

4. Add `.env` file in backend:

```
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

5. Run backend:

```
cd backend
npm start
```

6. Run frontend:

```
cd frontend
npm run dev
```

7. Open browser:

```
http://localhost:5173
```

---

## Screenshots

![Login](./../output-screenshots/Login%20Page.png)
![Sign In Page](./../output-screenshots/Sign%20in%20page.png)
![Student Dashboard](./../output-screenshots/Student%20Dashboard.png)
![Faculty Dashboard](./../output-screenshots/Faculty%20Dashboard.png)
![Admin Dashboard 1](./../output-screenshots/Admin%20Dashboard-1.png)
![Admin Dashboard 2](./../output-screenshots/Admin%20Dashboard-2.png)

---

## Assignment Info

Full Stack Development Lab Assignment 7
PCCOE

---

## Author

Developed as part of the Full Stack Development Lab curriculum.
