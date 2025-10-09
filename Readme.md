# SQL Query Optimizer

A full-stack web application that analyzes PostgreSQL queries and provides performance insights and a visual query plan.

## Description

This tool allows developers and database administrators to paste a SQL query, execute it against a connected PostgreSQL database, and receive an `EXPLAIN ANALYZE` plan. The application visualizes the JSON plan in an interactive tree and provides simple, human-readable insights to help identify performance bottlenecks, such as slow Sequential Scans.

## Features

-   **Full-Stack Architecture**: Decoupled React frontend and Node.js/Express backend API.
-   **Interactive Query Plan**: Renders complex JSON plans in a user-friendly, collapsible tree view.
-   **Performance Insights**: The backend analyzes the query plan to provide actionable advice (e.g., warning about Sequential Scans).
-   **CORS Enabled**: Securely handles cross-origin requests between the frontend and backend.
-   **Environment-Based Configuration**: Uses `.env` files for secure management of database credentials and API URLs.

## 🛠️ Tech Stack

-   **Frontend**: React.js, `react-json-view`
-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL (`pg` library)
-   **Deployment**: Frontend on Netlify, Backend on Render.

## 📂 Project Structure

This project uses a monorepo-like structure with two distinct applications:

-   `/client`: The Create React App frontend.
-   `/server`: The Node.js/Express backend API.
-   The root folder contains a `package.json` with a `concurrently` script to run both for local development.

## ⚙️ Local Setup

1.  **Clone the repository.**
2.  **Setup Backend**:
    ```bash
    cd server
    npm install
    cp .env.example .env # Create a .env file
    ```
    -   Fill in your PostgreSQL credentials in `server/.env`.
3.  **Setup Frontend**:
    ```bash
    cd ../client
    npm install
    cp .env.example .env # Create a .env file
    ```
    -   Ensure `REACT_APP_API_URL` in `client/.env` is set to `http://localhost:3001/api`.
4.  **Run the application**:
    -   From the root directory, run `npm install` to install `concurrently`.
    -   Then run `npm run dev` to start both servers."# SQL-Query-optimzer" 
