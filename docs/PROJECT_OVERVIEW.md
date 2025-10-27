# SmartThings Controller Overview

This project is a minimal full-stack proof of concept for controlling SmartThings-compatible lights from a single-page mobile-friendly web interface.

## Technology Stack

- **Backend:** Node.js with Express, Axios for SmartThings REST API calls, dotenv for configuration, and CORS to allow local development from different origins.
- **Frontend:** Plain HTML, CSS, and JavaScript served statically from the Express server.

## Backend

The backend (`server.js`) exposes three proxy endpoints under `/api/devices/:id` that translate client requests into SmartThings command payloads. It reads the SmartThings Personal Access Token (PAT) from the `ST_PAT` environment variable defined in a `.env` file and injects it into the Authorization header for every SmartThings API call. The helper `sendCommand` function centralizes HTTP handling, error normalization, and ensures the command format matches SmartThings expectations.

## Frontend

`public/index.html` renders a single device card labelled “Living Room” with On, Off, and Set Level actions. JavaScript in the page hardcodes a `deviceId` placeholder (replace with an actual SmartThings device ID) and issues `fetch` POST requests to the backend endpoints when users interact with the buttons. A status area displays success or error feedback for each command.

## Configuration and Usage

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `ST_PAT` to a valid SmartThings personal access token.
3. Replace `YOUR_DEVICE_ID_HERE` in `public/index.html` with your target light’s device ID.
4. Start the server with `npm start` and open `http://localhost:3000` in a browser to use the controller.

This setup keeps the PAT on the server, proxies client commands securely, and can be expanded with richer UI, authentication, or additional device capabilities in future iterations.
