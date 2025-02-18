# Financial Management API

A RESTful API for managing personal finances built with Node.js, Express, and Firebase.

## Overview

This API provides endpoints for managing users, expenses, and income data with Firebase integration. It includes user authentication, CRUD operations, and search functionality.

## Features

- User Management (CRUD operations)
- Expense Tracking
- Income Management
- Search Functionality
- Firebase Integration
- Error Handling
- Input Validation

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Firebase Account and Project

## Installation & Dependency Explanations:

1. **Core Dependencies:**

   - `express`: Web framework for Node.js
   - `firebase-admin`: Firebase SDK for server
   - `dotenv`: Environment variables management
   - `cors`: Cross-Origin Resource Sharing

2. **Dev Dependencies:**

   - `nodemon`: Auto-restart server during development

### Installation Steps:

1. **Create project folder:**
2. **Initialize npm:**
   -npm init -y
   -npm install express firebase-admin dotenv cors
   -npm install nodemon --save-dev

3. **Create project structure:**
   mkdir -p src/{controllers,routes,middleware,config}
