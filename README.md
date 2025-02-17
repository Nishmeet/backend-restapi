# Financial Management API

A RESTful API for managing personal finances built with Node.js, Express, and Firebase.

## Features

- User Management (CRUD operations)
- Expense Tracking
- Income Management
- Search Functionality

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your Firebase credentials
4. Run the server: `npm start`

## API Endpoints

### Users

- GET /users - Get all users
- POST /users - Create user
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user
- GET /users/search - Search users
- GET /users/search/:email - Search by email

### Expenses & Income

- GET /expenses - Get all expenses
- POST /expenses - Create expense
- PUT /expenses/:id - Update expense
- DELETE /expenses/:id - Delete expense
