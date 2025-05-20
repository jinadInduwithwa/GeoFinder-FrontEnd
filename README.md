# GeoFinder

GeoFinder is a full-stack web application that enables users to explore detailed country information, manage favorite countries, and handle user authentication. The frontend is built with React and Tailwind CSS, while the backend uses Node.js, Express, and MongoDB. The application integrates with a REST API (e.g., REST Countries API) to fetch country data and provides a responsive, user-friendly interface with features like favorite management and toast notifications.

### Live demo site - https://geo-finder-front-end-git-main-jinadinduwithwas-projects.vercel.app/

https://github.com/user-attachments/assets/af28c8ad-06f6-4d66-a7e7-5a7f20de95aa

Development Report: React Frontend Application with REST Countries API - [report.pdf](https://github.com/user-attachments/files/20026684/report.pdf)


## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Build Instructions](#build-instructions)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication APIs](#authentication-apis)
  - [Favorites APIs](#favorites-apis)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Country Exploration:** View country details (name, capital, flag, etc.) with an interactive interface.
- **Favorites Management:** Authenticated users can add/remove countries to/from their favorites list.
- **User Authentication:** Supports registration, login, and logout with JWT-based authentication.
- **Responsive Design:** Optimized for desktop and mobile using Tailwind CSS.
- **Real-time Notifications:** Uses react-hot-toast for success/error messages.
- **REST API Integration:** Fetches country data and manages user favorites via a custom backend.

## Technologies

### Frontend
- React 18
- React Router 6
- Tailwind CSS
- Axios
- React-hot-toast
- Jest, React Testing Library, jest-fetch-mock

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- Cookie-parser

### Tools
- Yarn (package manager)
- Vite (frontend build tool)
- Git (version control)
- MongoDB Atlas (optional for cloud database)

## Project Structure
```
GeoFinder/
├── Client/                  # Frontend (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Context API (CountryContext.jsx, AuthContext.jsx)
│   │   ├── pages/           # Page components (Favourite.jsx)
│   │   ├── tests/           # Jest test files (Favorites.test.jsx, Favorites.integration.test.jsx)
│   │   ├── __mocks__/       # Mock files (react-hot-toast.js)
│   ├── .babelrc             # Babel configuration
│   ├── jest.config.js       # Jest configuration
│   ├── jest.setup.js        # Jest setup
│   ├── package.json         # Frontend dependencies
├── backend/                 # Backend (Express/MongoDB)
│   ├── controllers/         # API controllers (favoriteController.js)
│   ├── middleware/          # Middleware (authMiddleware.js)
│   ├── models/              # Mongoose models (UserModel.js)
│   ├── routes/              # API routes
│   ├── server.js            # Express server
│   ├── package.json         # Backend dependencies
├── .gitignore               # Git ignore file
├── README.md                # Project documentation
```

## Prerequisites
- Node.js: Version 18 or higher
- Yarn: Version 1.22 or higher
- MongoDB: Local installation or MongoDB Atlas account
- Git: For version control
- Browser: Chrome, Firefox, or any modern browser

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```
   cd D:\Y3 S1\Aplication Framework - AF\Assignment 02\af-2-jinadInduwithwa\GeoFinder\backend
   ```

2. **Install dependencies:**
   ```
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the backend folder.
   - Add the following:
     ```
     MONGO_URI=mongodb://localhost:27017/geofinder
     JWT_SECRET=your_jwt_secret_here
     PORT=5000
     BASE_URL=https://restcountries.com/v3.1
     ```
   - For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.
   - Generate a secure `JWT_SECRET` (e.g., using `openssl rand -base64 32`).

4. **Start MongoDB:**
   - For local MongoDB, ensure the service is running:
     ```
     mongod
     ```
   - For MongoDB Atlas, verify database connectivity.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```
   cd \Client
   ```

2. **Install dependencies:**
   ```
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the Client folder.
   - Add the following:
     ```
     VITE_API_URL=http://localhost:5000/api/v1
     ```
   - This points to the backend API.

## Build Instructions

```
npm build
```

## Running the Application

**Start the frontend and backend**
```
npm run dev
```
- The app runs on http://localhost:5173 (default Vite port).

**Access the application:**
- Open http://localhost:5173 in your browser.
- Register or log in to explore countries and manage favorites.

## API Documentation

The backend provides RESTful APIs for authentication and favorites management. All endpoints are prefixed with `/api/v1`.

### Authentication APIs

#### Register:
- **Endpoint:** `POST /auth/register`
- **Body:**
  ```
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```
  {
    "msg": "User registered successfully",
    "user": { "id": "123", "email": "user@example.com" }
  }
  ```

#### Login:
- **Endpoint:** `POST /auth/login`
- **Body:**
  ```
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```
  {
    "msg": "Login successful",
    "user": { "id": "123", "email": "user@example.com" }
  }
  ```
- Sets a JWT cookie for authentication.

#### Logout:
- **Endpoint:** `POST /auth/logout`
- **Response:**
  ```
  { "msg": "Logout successful" }
  ```
- Clears the JWT cookie.

### Favorites APIs

#### Get Favorites:
- **Endpoint:** `GET /favorites`
- **Headers:** `Cookie: token=your_jwt_token`
- **Response:**
  ```
  {
    "favorites": ["USA", "CAN"]
  }
  ```

#### Add Favorite:
- **Endpoint:** `POST /favorites`
- **Headers:** `Cookie: token=your_jwt_token`
- **Body:**
  ```
  { "cca3": "USA" }
  ```
- **Response:**
  ```
  {
    "favorites": ["USA"]
  }
  ```

#### Remove Favorite:
- **Endpoint:** `DELETE /favorites/:cca3`
- **Headers:** `Cookie: token=your_jwt_token`
- **Example:** `DELETE /favorites/USA`
- **Response:**
  ```
  {
    "favorites": []
  }
  ```

> **Note:** Favorites endpoints require authentication. Use tools like Postman to test APIs, including the JWT cookie from `/auth/login`.

## Testing

The frontend includes unit and integration tests for the Favourite page using Jest and React Testing Library.

1. **Navigate to the frontend directory:**
   ```
   cd Client
   ```

2. **Run tests:**
   ```
   npm test
   ```

3. **Run tests in watch mode:**
   ```
   npm test:watch
   ```

4. **Generate test coverage:**
   ```
   npm test:coverage
   ```

**Test Files:**
- `Client/src/tests/pages/Favorites.test.jsx`: Unit tests for rendering states and interactions.
- `Client/src/tests/pages/Favorites.integration.test.jsx`: Integration tests for API interactions.


- **CORS Issues:**
  - Ensure `backend/server.js` includes CORS:
    ```
    import cors from 'cors';
    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
    ```

- **API Fetch Errors:**
  - Verify `VITE_API_URL` in `Client/.env`.
  - Ensure backend is running on `http://localhost:5000`.

## Contributing

- Fork the repository.
- Create a feature branch (`git checkout -b feature/your-feature`).
- Commit changes (`git commit -m "Add your feature"`).
- Push to the branch (`git push origin feature/your-feature`).
- Open a pull request.

## License

This project is licensed under the MIT License.

