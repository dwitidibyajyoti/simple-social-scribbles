# Simple Social Scribbles

A simple social media app with posts, comments (including nested replies), and a user information form. Built with React, Express, and MongoDB.

## Features
- Social feed with posts (stored in MongoDB)
- Nested comments and replies (stored in MongoDB)
- Like and comment count per post
- User information form with validation
- Modern UI with React and Tailwind CSS
- Environment variable support using dotenv

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/simple-social-scribbles.git
cd simple-social-scribbles
```

### 2. Install dependencies
```bash
cd server
npm install
cd ../
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory with the following content:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```
- Replace `your_mongodb_connection_string` with your actual MongoDB URI.
- You can change the `PORT` if needed.

**Note:** The `.env` file is ignored by git (see `.gitignore`).

### 4. Start the backend server
```bash
cd server
node server.js
```
The server will run on `http://localhost:3000` by default.

### 5. Start the frontend
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` (or as configured by Vite).

## API Endpoints

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create a new post
- `PUT /posts/:id/like` - Like a post

### Comments
- `GET /comments/:postId` - Get all comments for a post (nested)
- `POST /comments` - Add a comment or reply (supports `postId`, `text`, `parentId`)

### User Form
- `POST /submit` - Submit user information form

## Environment Variables
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Port for the Express server (default: 3000)

## License
MIT
