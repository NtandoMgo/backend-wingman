
# Wingman Backend API

This is the backend for the **Wingman** dating app. The backend is built using **Node.js**, **Express.js**, and **MongoDB**. It handles user authentication, messaging, and meetups for students only, with email domain validation for registration.

### Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Messaging](#messaging)
  - [Meetups](#meetups)
- [Running the Server Locally](#running-the-server-locally)
- [Testing the API](#testing-the-api)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Wingman is a dating app specifically for students. The backend API handles:

- **User Registration and Authentication**: Users can sign up with valid tertiary institution email domains (e.g., `@myuct.ac.za`).
- **Messaging**: Users can send and receive messages.
- **Meetups**: Users can create and join meetups.

This backend provides secure JWT-based authentication, using MongoDB to store user data and other application-related information.

---

## Installation

Follow these steps to set up the backend on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/NtandoMgo/wingman-backend.git
cd wingman-backend
```

### 2. Install Dependencies
Make sure you have **Node.js** installed. Then, install all the required dependencies by running:

```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root of the project with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wingman
JWT_SECRET=your_jwt_secret_key
```

- **PORT**: The port on which the backend will run.
- **MONGO_URI**: MongoDB connection string (update for your environment).
- **JWT_SECRET**: Secret key used for signing JWT tokens.

---

## API Endpoints

### Authentication

#### 1. Register a new user
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john_doe@myuct.ac.za",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - **Success**:  
    ```json
    {
      "message": "User created successfully"
    }
    ```

  - **Failure** (Invalid email domain):  
    ```json
    {
      "message": "Email must belong to a valid tertiary institution domain."
    }
    ```

  - **Failure** (Email already in use):  
    ```json
    {
      "message": "User already exists"
    }
    ```

#### 2. Login an existing user
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "john_doe@university.edu",
    "password": "securepassword123"
  }
  ```

- **Response**:
  - **Success**:  
    ```json
    {
      "token": "your_jwt_token"
    }
    ```

  - **Failure** (Invalid credentials):  
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

---

### Messaging

#### 1. Send a message
- **Endpoint**: `POST /api/messages`
- **Request Body**:
  ```json
  {
    "receiverId": "receiver_user_id",
    "content": "Hello, how are you?"
  }
  ```
- **Response**:
  - **Success**:  
    ```json
    {
      "message": "Message sent successfully"
    }
    ```

  - **Failure**:  
    ```json
    {
      "message": "Error sending message"
    }
    ```

#### 2. Get all messages
- **Endpoint**: `GET /api/messages`
- **Response**:
  - **Success**:  
    ```json
    [
      {
        "senderId": "sender_user_id",
        "receiverId": "receiver_user_id",
        "content": "Hello, how are you?",
        "timestamp": "2025-01-10T12:00:00Z"
      }
    ]
    ```

---

### Meetups

#### 1. Create a meetup
- **Endpoint**: `POST /api/meetups`
- **Request Body**:
  ```json
  {
    "location": "University Park",
    "dateTime": "2025-01-20T12:00:00Z",
    "description": "Let's meet at the park!",
    "participants": ["user_id_1", "user_id_2"]
  }
  ```

- **Response**:
  - **Success**:  
    ```json
    {
      "message": "Meetup created successfully"
    }
    ```

---

## Running the Server Locally

To start the server locally, run the following command:

```bash
node src/server.js
```

The server will run on the port specified in your `.env` file (default: `5000`).

You can access the backend API at `http://localhost:5000`.

---

## Testing the API

You can use **Postman** or **cURL** to test the API endpoints. Below are the example requests you can use:

- **Register a user**: `POST http://localhost:5000/api/auth/register`
- **Login a user**: `POST http://localhost:5000/api/auth/login`
- **Send a message**: `POST http://localhost:5000/api/messages`
- **Get messages**: `GET http://localhost:5000/api/messages`

Refer to the **API Endpoints** section above for detailed request and response formats.

---

## Contributing

If you'd like to contribute to the backend, feel free to fork this repo and create a pull request with your changes. Please ensure your changes are well-documented and tested.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes for Frontend Developer:
- Make sure to include the `Authorization` header with the JWT token in all requests that require authentication (e.g., sending messages, creating meetups).
- Use the appropriate API endpoints to handle the functionality required for the frontend.
  
---
