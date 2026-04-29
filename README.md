# 📚 Library Management System — DBMS Mini Project

A full-stack Library Management System built with **Node.js, Express, MongoDB & Mongoose**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Views | EJS Templates |
| Styling | Vanilla CSS |

## Features

- **Books** — Add, edit, delete, search books by title/author/ISBN, filter by genre
- **Members** — Register members, auto-generate Membership IDs (LIB0001...), track issue history
- **Issues** — Issue books, return books, auto-calculate fines (₹5/day), track overdue books
- **Dashboard** — Stats overview: total books, members, active issues, overdue count

## Database Schema

### Books
```
title, author, isbn (unique), genre, totalCopies, availableCopies, publishedYear, publisher
```

### Members
```
name, email (unique), phone, membershipId (auto), membershipType, isActive, address
```

### Issues
```
book (ref), member (ref), issueDate, dueDate, returnDate, status, fine, remarks
```

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

### Install
```bash
cd library-mgmt
npm install
```

### Configure
Edit `.env` if needed:
```
MONGO_URI=mongodb://localhost:27017/library_db
PORT=3000
```

### Start
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Open http://localhost:3000

## API Routes

### Books
| Method | Route | Description |
|--------|-------|-------------|
| GET | /books | List all books |
| GET | /books/new | New book form |
| POST | /books | Create book |
| GET | /books/:id | View book |
| GET | /books/:id/edit | Edit form |
| PUT | /books/:id | Update book |
| DELETE | /books/:id | Delete book |

### Members
| Method | Route | Description |
|--------|-------|-------------|
| GET | /members | List all members |
| POST | /members | Register member |
| PUT | /members/:id | Update member |
| DELETE | /members/:id | Remove member |

### Issues
| Method | Route | Description |
|--------|-------|-------------|
| GET | /issues | List all issues |
| POST | /issues | Issue a book |
| POST | /issues/:id/return | Return a book |
| DELETE | /issues/:id | Delete record |

## Project Structure
```
library-mgmt/
├── models/
│   ├── Book.js
│   ├── Member.js
│   └── Issue.js
├── routes/
│   ├── books.js
│   ├── members.js
│   └── issues.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── books/
│   ├── members/
│   ├── issues/
│   ├── dashboard.ejs
│   └── 404.ejs
├── .env
├── server.js
└── package.json
```
