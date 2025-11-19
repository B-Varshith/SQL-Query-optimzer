# PostgreSQL Query Optimizer

A full-stack web application that analyzes PostgreSQL queries and provides performance insights and a visual query plan.

## Description

This tool allows developers and database administrators to paste a SQL query, execute it against a connected PostgreSQL database, and receive an `EXPLAIN ANALYZE` plan. The application visualizes the JSON plan in an interactive tree and provides simple, human-readable insights to help identify performance bottlenecks.

## Features

-   **Full-Stack Architecture**: Decoupled React frontend and Node.js/Express backend API.
-   **Interactive Query Plan**: Renders complex JSON plans in a user-friendly, collapsible tree view.
-   **Secure Analysis**: Uses database transactions to safely run `EXPLAIN ANALYZE` without permanently modifying data.
-   **Modern UI**: Dark mode interface with syntax highlighting for SQL.
-   **Environment-Based Configuration**: Uses `.env` files for secure management of database credentials.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, `react-simple-code-editor`, `prismjs`, `react-json-view`
-   **Backend**: Node.js, Express.js, `pg` (node-postgres)
-   **Testing**: Jest, Supertest

## 📂 Project Structure

-   `/client`: The React frontend (Vite).
    -   `src/components`: Reusable UI components (`QueryInput`, `QueryResults`).
-   `/server`: The Node.js/Express backend API.
    -   `src/controllers`: Business logic for handling requests.
    -   `src/routes`: API route definitions.
    -   `src/middleware`: Error handling and other middleware.
    -   `tests`: Integration tests.

## 🔒 Security

To ensure safety when running arbitrary queries:
-   **Transaction Rollback**: Every analysis request is wrapped in a database transaction (`BEGIN` ... `ROLLBACK`). This ensures that even if a user submits an `INSERT`, `UPDATE`, or `DELETE` query, the changes are **never committed** to the database.

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
    ```
4.  **Run the application**:
    -   **Backend**: `cd server && npm run dev`
    -   **Frontend**: `cd client && npm run dev`

## 🧪 Running Tests

To run the backend integration tests:

```bash
cd server
npm test
```
