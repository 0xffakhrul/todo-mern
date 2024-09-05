## Full Stack Todo App

### 💻 About

This is a full-stack Todo application built with the MERN stack (MongoDB, Express.js, React, Node.js). The app allows users to create, read, update, and delete todo items.

### 🚀 Run locally

Clone the project using the following command:

```
git clone https://github.com/0xffakhrul/todo-mern
```

Navigate to the project directory using the following command:

```
cd todo-mern
```

Install client dependencies and start the client using the following commands:

```
cd client
npm install
npm run dev
```

Install server dependencies, build and start the server using the following commands:

```
cd server
npm install
npm run build
npm start
```

### ⚙️ Environment variables

Before running the app, make sure to create `.env` files for both the server and client directories with the following variables:

Client environment variables:

```
(.env.local)
VITE_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>

(.env)
BACKEND_URL=<YOUR_BACKEND_URL>
```

Server environment variables:

```
PORT=8000
MONGO_URI=<THE_URL_OF_YOUR_MONGODB_DATABASE>
```
