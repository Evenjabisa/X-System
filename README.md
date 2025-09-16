# Node.js — Project Documentation

> Educational project: A mini system using Node.js and MongoDB covering user registration (Sign Up), login, updating user profile photo, and managing data (CRUD).

## Overview

This project demonstrates how to build a simple API for managing users and data using:

* Node.js (Express)
* MongoDB (Mongoose)
* Authentication with JWT
* Password hashing with `bcrypt`
* Uploading and updating user profile images with `multer` (or Cloudinary as an alternative)

Goal: Provide a practical example for learners who already know the basics of Node.js.

## Features

* User registration (Sign Up)
* User login (Login) with JWT issuance
* Protected routes using middleware with JWT verification
* Upload/update user profile picture
* CRUD operations on users (Create, Read, Update, Delete)
* Organized structure (routes, controllers, models, middleware)
* Clear error messages and input validation

## Prerequisites

* Node.js (v16+)
* npm or yarn
* MongoDB (local or Atlas)

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd project-folder
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/node_level2_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
# If using Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Note: If using MongoDB Atlas, replace `MONGO_URI` with your connection string.

## Running the Project

```bash
npm run dev
# or
node server.js
```

By default, the server runs on `http://localhost:3000` unless the `PORT` is changed.

## Suggested Project Structure

```
project-folder/
├─ controllers/
│  ├─ authController.js
│  └─ userController.js
├─ middleware/
│  ├─ authMiddleware.js
│  └─ uploadMiddleware.js
├─ models/
│  └─ User.js
├─ routes/
│  ├─ authRoutes.js
│  └─ userRoutes.js
├─ utils/
│  └─ cloudinary.js (optional)
├─ config/
│  └─ db.js
├─ uploads/  (if storing images locally)
├─ .env
├─ package.json
└─ server.js
```

## Example User Model (Mongoose)

```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  profileImage: { type: String }, // Image URL (Cloudinary or local path)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

## Key Features Explained

### 1. Sign Up

* Accepts `username`, `email`, `password`
* Validate inputs (e.g., with express-validator)
* Hash password with `bcrypt`
* Save user in MongoDB

**Security Note:** Do not return the password in API responses.

### 2. Login

* Check if user exists by email/username
* Compare password with `bcrypt.compare`
* Generate JWT containing `userId`
* Return JWT to client (in body or cookies)

### 3. Auth Middleware (Protected Routes)

* Extract JWT from `Authorization: Bearer <token>` header or cookies
* Verify token using `jwt.verify`
* Attach user data to `req.user`
* Call `next()`

### 4. Upload/Update Profile Photo

* Use `multer` to handle file upload (e.g., field name: `avatar`)
* Options:

  * Local storage in `uploads/`
  * Cloud storage (Cloudinary, S3)
* Save the image path/URL in `profileImage` field of user document

**Example (multer setup):**

```js
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
```

Route example:

```js
router.post('/profile-photo', requireAuth, upload.single('avatar'), userController.updatePhoto);
```

### 5. REST API Endpoints

* `POST /api/auth/signup` — Register a new user
* `POST /api/auth/login` — Login user
* `POST /api/auth/logout` — Logout (clear cookies)
* `GET /api/users` — Get all users (protected)
* `GET /api/users/:id` — Get user by ID (protected)
* `PUT /api/users/:id` — Update user (protected)
* `DELETE /api/users/:id` — Delete user (protected)
* `POST /api/users/:id/photo` — Upload/update user profile photo (protected)

## Example Request — Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "status": "success",
  "token": "<jwt-token>",
  "data": { "user": { "_id": "...", "username": "...", "email": "...", "profileImage": "..." } }
}
```

## Error Handling & Validation

* Use `try/catch` in controllers
* Return clear responses (e.g., `{ success: false, message: '...' }`)
* Validate input with `express-validator` or `joi`

## Security Tips

* Store `JWT_SECRET` in `.env` (never commit `.env` to Git)
* Limit file upload size in multer
* Use HTTPS in production
* Apply rate limiting for login attempts
* Avoid logging sensitive data

## API Testing

Use Postman or Insomnia to test the endpoints.

## Suggested `package.json` Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## Example .env File

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/node_level2_db
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
```

## How to Add Profile Photo Update Feature

1. Create a protected route with multer handling file upload (`avatar` field).
2. In the controller, save the file locally or upload to Cloudinary.
3. Update `User` document with the image path/URL.
4. Return updated user data in the response.

## Notes for Learners/Developers

* You can extend the project with: password reset via email, role-based authorization (Admin/User), or OAuth (Google/Facebook).
* If using Cloudinary, create a utility file (`utils/cloudinary.js`) and use the official library.

---

### Contact

For inquiries or support, reach out at: **+201022214317**

---

Note: This is a sample README file — adjust routes, code examples, and settings based on your actual project.
"# X-System" 
