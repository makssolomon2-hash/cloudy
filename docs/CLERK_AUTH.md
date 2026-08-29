# Enable Clerk Authentication

Cloudy starts in local demo mode by default. No sign-in is required while `VITE_AUTH_ENABLED` is `false` or unset.

## 1. Create a Clerk application

1. Create an application at [Clerk Dashboard](https://dashboard.clerk.com/).
2. Choose a React application.
3. In **User & Authentication**, enable the sign-in methods your product will support. Email and password is a sensible minimum for local testing.
4. In **Paths**, add `http://localhost:5173` as a development origin.

## 2. Configure local environment variables

Create a `.env` file in the project root using `.env.example` as the template. Add the keys from Clerk's API Keys page and enable authentication:

```dotenv
VITE_AUTH_ENABLED=true
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLIENT_ORIGIN=http://localhost:5173
PORT=3001
```

`VITE_CLERK_PUBLISHABLE_KEY` is used by the browser. `CLERK_SECRET_KEY` is server-only; never put it in client code, commit it, or send it in chat. The project ignores `.env` files and preserves `.env.example`.

## 3. Run Cloudy

Start the frontend and API in separate terminals:

```powershell
npm run dev
```

```powershell
npm run dev:server
```

Open `http://localhost:5173`. Cloudy will show its styled **Sign in** and **Create account** screens. New accounts and sessions are created and managed by Clerk.

## 4. Verify the authenticated API

After you sign in, the frontend receives a Clerk session. The Express API exposes:

| Route | Access | Purpose |
| --- | --- | --- |
| `GET /api/health` | Public | Confirms the API is running. |
| `GET /api/me` | Clerk session required | Returns the current Clerk user and session IDs. |

The Vite development server proxies `/api` to `http://localhost:3001`. Future protected server routes should use `requireAuth()` and `getAuth()` in `server/index.js`, following the existing `/api/me` example.

## 5. Switch back to demo mode

Set the following value and restart Vite:

```dotenv
VITE_AUTH_ENABLED=false
```

The app bypasses Clerk and opens directly with the local demo profile. The backend is not required in this mode.

## Deployment checklist

- Add the production Cloudy URL to Clerk's allowed origins and redirect URLs.
- Store `CLERK_SECRET_KEY` in your deployment provider's encrypted environment settings.
- Set `VITE_AUTH_ENABLED=true` and `VITE_CLERK_PUBLISHABLE_KEY` in the frontend deployment environment.
- Restrict `CLIENT_ORIGIN` to the deployed frontend URL or URLs.
- Keep account authorization checks in the API; never rely solely on the client-side signed-in state.