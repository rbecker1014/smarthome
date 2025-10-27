# SmartThings Controller Project Overview

This project delivers a lightweight, mobile-friendly web client paired with an
Express proxy for sending lighting commands to the SmartThings platform. The
backend mediates between the browser and SmartThings' REST API, while the
frontend offers a minimal control panel suitable for phones and tablets.

## Directory Layout

| Path | Description |
| --- | --- |
| `server.js` | Node.js/Express entry point that loads environment variables, serves static assets, and exposes SmartThings proxy endpoints. |
| `public/index.html` | Standalone HTML page with inline CSS/JS that renders the lighting control UI and issues `fetch` requests to the backend. |
| `docs/` | Project documentation. |
| `.env` | Developer-local environment file (ignored by Git) that stores secrets such as the SmartThings personal access token. |

> **Note:** Supporting files like `README.md` or experimental HTML prototypes are
> not authoritative for project behavior and can be ignored when reviewing the
> application flow.

## Backend Architecture (`server.js`)

1. **Configuration** – Uses `dotenv` to read `SMARTTHINGS_PAT` and `PORT` from the
   `.env` file. Startup halts with a descriptive error if the personal access
   token is missing to prevent unauthenticated API calls.
2. **Middleware setup** – Applies CORS, JSON body parsing, and static file
   serving (from `public/`) so that the same process can deliver both API and UI
   traffic.
3. **SmartThings helper** – Centralizes HTTP requests in `sendCommand`, which
   posts to `https://api.smartthings.com/v1/devices/:id/commands` using Axios.
   The helper normalizes SmartThings error responses into JavaScript `Error`
   objects with HTTP status codes for consistent downstream handling.
4. **Lighting routes** – Exposes POST endpoints for `/api/devices/:id/on`,
   `/off`, and `/level`. The dimmer route rounds and clamps user input to the
   SmartThings-accepted range (0–100) before forwarding it.

## Frontend Architecture (`public/index.html`)

- **Responsive layout** – Inline CSS constrains the content width for comfortable
  use on mobile devices while keeping the markup minimal.
- **Device card** – Presents on/off buttons, a numeric dimmer input, and a status
  area for feedback.
- **Command wiring** – Event listeners gather input, compose POST requests to the
  Express routes (prefixing them with the configurable `BASE_URL` that points to
  the forwarded backend host), and render success or error messages returned from
  the server.
- **Device configuration** – Includes a `deviceId` placeholder string that must
  be replaced with a real SmartThings device identifier during setup.

## Runtime Flow

1. A user opens `http://localhost:3000`, and Express serves `public/index.html`.
2. UI interactions trigger `fetch` requests to `/api/devices/:id/...` routes.
3. The backend invokes `sendCommand`, authenticating with the PAT pulled from
   `.env` and relaying the request to SmartThings.
4. SmartThings responds with the command status, which is returned to the client
   and displayed in the status region.

## Configuration & Local Development

1. Run `npm install` to install dependencies.
2. Create a `.env` file with:

   ```env
   SMARTTHINGS_PAT=your-personal-access-token
   PORT=3000
   ```

3. Replace `YOUR_DEVICE_ID_HERE` in `public/index.html` with the target
   SmartThings device ID.
4. Start the server via `npm start` (or `node server.js`) and visit the local URL
   in a browser to test commands.

## Extensibility Ideas

- Support multiple devices by parameterizing the UI and adding new Express
  routes as needed.
- Surface additional SmartThings capabilities (e.g., color temperature, scenes,
  motion sensors) by introducing new commands in the backend and corresponding UI
  controls.
- Add authentication or rate limiting if the server is deployed outside a
  trusted network.

This architecture keeps credentials out of source control, funnels all SmartThings
interactions through a single proxy, and presents a focused UI so you can expand
or customize the experience without reworking the foundation.
