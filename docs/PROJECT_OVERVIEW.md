# SmartThings Controller Project Overview

This repository contains a lightweight mobile-friendly web application that proxies
SmartThings lighting commands through a Node.js/Express backend. The codebase is
deliberately small, making it easy to extend while keeping sensitive credentials
outside of version control.

## Architecture at a Glance

| Layer      | Technology | Purpose |
| ---------- | ---------- | ------- |
| Backend    | Node.js with Express, Axios, and dotenv | Serves the static client, exposes SmartThings proxy endpoints, and injects the personal access token into outbound API calls. |
| Frontend   | Static HTML, CSS, and vanilla JavaScript | Renders a single-device control panel optimized for small screens and issues fetch requests to the backend. |

### Key Files and Directories

- `server.js` – Express application with proxy routes for `on`, `off`, and `setLevel`
  SmartThings commands. It loads configuration from environment variables, guards
  against missing tokens, and normalizes SmartThings API errors before returning
  them to the client.
- `public/index.html` – Single-page UI that renders a device card with controls.
  Inline JavaScript captures button interactions, validates dimmer levels, and
  sends JSON requests to the backend endpoints.
- `docs/` – Project documentation, including this overview.

## Backend Flow (`server.js`)

1. Loads the SmartThings personal access token (`SMARTTHINGS_PAT`) and `PORT` from a
   `.env` file using `dotenv`. Missing credentials halt the server during startup to
   prevent unauthenticated requests.
2. Registers middleware for CORS, JSON parsing, and static asset delivery from
   `public/` so the same Express app can serve the client bundle.
3. Defines a reusable `sendCommand` helper that posts command payloads to
   `https://api.smartthings.com/v1/devices/:id/commands` with the bearer token
   applied. HTTP errors are converted to structured exceptions so the routes return
   consistent JSON responses.
4. Exposes three POST routes under `/api/devices/:id` that wrap common lighting
   actions (`on`, `off`, and `level`). The `level` route bounds and rounds the input
   before sending it to SmartThings, ensuring valid dimmer values between 0 and 100.

## Frontend Flow (`public/index.html`)

- Presents a simple “Living Room” device card styled for narrow viewports.
- Provides buttons to toggle the light and a numeric input plus button to adjust
  brightness.
- Calls the backend endpoints via `fetch`, displaying success or error messages in a
  status area so users receive immediate feedback.
- Uses a placeholder `deviceId` string (`YOUR_DEVICE_ID_HERE`) that must be replaced
  with a real SmartThings device identifier for production use.

## Configuration and Local Development

1. Install dependencies with `npm install`.
2. Create a local `.env` file (ignored by Git) with the following keys:

   ```env
   SMARTTHINGS_PAT=your-personal-access-token
   PORT=3000
   ```

   The PAT should be generated and stored locally only.
3. Update the device identifier placeholder in `public/index.html` with the ID of
   the SmartThings device you intend to control.
4. Start the server with `npm start` (or `node server.js`) and open
   `http://localhost:3000` in a browser to interact with the controller.

## Extending the Project

- **Multiple devices:** Duplicate the UI card structure and parameterize device IDs
  to control more than one light from the same page.
- **Additional capabilities:** Add new Express routes that proxy other SmartThings
  capabilities (e.g., color temperature or scenes) and surface them through new UI
  controls.
- **Authentication:** Introduce user authentication or IP restrictions on the
  Express server if the app will run outside a trusted network.

By separating configuration, backend proxying, and a minimal client, the project
provides a clear foundation for experimenting with SmartThings automations while
keeping credentials secure on the developer’s machine.
