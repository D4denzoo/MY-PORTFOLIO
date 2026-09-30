# Denzel Osward Chilewa — Portfolio

Personal portfolio for Denzel Osward Chilewa, a Data Science graduate based in Dar es Salaam. The repository has two separate parts:

- **Frontend:** a static site. The entry point is `index.html`, with styles in `css/` and behavior in `js/`. It is meant to be deployed on Vercel from the repository root.
- **Backend:** a Node.js and Express API in `backend/`. It is meant to be deployed on Render, with `backend` as the service root directory.

Bootstrap 5, Font Awesome, and the Google fonts Fraunces and Manrope are loaded from CDNs in `index.html`. Custom styles are in `css/style.css`. Custom behavior is in `js/app.js`.

## Repository structure

```
index.html                 Static site entry point
thanks.html                Static thank-you page
css/style.css              Site styles
js/app.js                  Site behavior, including project loading
assets/images/profile.jpg  Profile photo
backend/server.js          Express API (this is what npm start runs)
backend/package.json       Backend dependencies and start script
backend/package-lock.json
backend/.env.example       Example environment variables
backend/.gitignore         Ignores backend/.env and node_modules
backend/data/              JSON files present in the repo
backend/routes/            Route modules present in the repo
```

`npm start` runs `node server.js`. `server.js` does not import `backend/data/` or `backend/routes/`. The live API is the set of routes defined in `server.js`.

## Frontend

No install or build step is required.

Open `index.html` in a browser, or serve the repository root:

```bash
npx serve .
```

The projects section asks `window.PORTFOLIO_API` for repositories. That value is set in `index.html`:

```html
<script>window.PORTFOLIO_API = 'https://denzel-portfolio-api.onrender.com';</script>
```

`js/app.js` requests `GET ${PORTFOLIO_API}/api/projects` and waits up to 4 seconds. If that request fails or returns no list, the page requests `https://api.github.com/users/D4denzoo/repos` directly. If that also fails, it shows a small built-in list of repositories.

The contact form sends `POST ${window.PORTFOLIO_API}/api/contact`. The page shows success only when that request returns a successful response. The API returns success only after Resend or Nodemailer accepts the message.

## Backend

From `backend/`:

```bash
cd backend
npm install
```

Copy the example environment file, then edit the values you need:

```bash
# Windows
copy .env.example .env

# macOS or Linux
cp .env.example .env
```

Start the API:

```bash
npm start
```

`package.json` defines one script, `start`, which runs `node server.js`. The process listens on `process.env.PORT` or port `5000`. A local health check is [http://localhost:5000/](http://localhost:5000/).

`.env` is listed in `backend/.gitignore`. Do not commit it.

### Environment variables

These are the variables `server.js` reads. Names match `backend/.env.example`.

| Variable | Required | Used for |
|---|---|---|
| `PORT` | No | Listen port. Defaults to `5000`. Render sets this. |
| `GITHUB_TOKEN` | No | Sent as a Bearer token when `GET /api/projects` calls the GitHub API. |
| `EMAIL_PROVIDER` | Yes | `resend` or `gmail`. The server uses only this value. It does not fall back to the other provider. |
| `RESEND_API_KEY` | Yes when `EMAIL_PROVIDER=resend` | Resend API key. Set this only on Render. |
| `CONTACT_FROM` | No | Sender address. Defaults to `Portfolio <onboarding@resend.dev>`. |
| `CONTACT_TO` | No | Inbox that receives messages. Defaults to `denzelosward109@gmail.com`. |
| `EMAIL_USER` | Yes when `EMAIL_PROVIDER=gmail` | SMTP username. Ignored when the provider is Resend. |
| `EMAIL_PASS` | Yes when `EMAIL_PROVIDER=gmail` | SMTP password. Must be a Gmail App Password, not a normal Gmail password. Ignored when the provider is Resend. |
| `ADMIN_SECRET` | No | Compared with the `x-admin-secret` header on `GET /api/messages`. |

`POST /api/contact` returns `500` when no provider is configured or the provider rejects the message. It returns `200` only after the provider accepts the message. Accepted messages are also kept in memory until the process restarts.

### API endpoints

Defined in `backend/server.js`:

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/` | Health check. Returns `{ status: "ok", ... }`. |
| `GET` | `/api/profile` | Returns the profile object embedded in `server.js`. |
| `GET` | `/api/skills` | Returns the skills array embedded in `server.js`. |
| `GET` | `/api/projects` | Loads public repositories for GitHub user `D4denzoo`, drops forks, and returns `name`, `description`, `url`, `homepage`, `language`, `stars`, `forks`, and `updatedAt`. Responds with `502` if GitHub cannot be reached. |
| `POST` | `/api/contact` | Expects JSON `name`, `email`, `subject`, and `message`. Returns `400` when validation fails, `500` when email delivery fails, and `200` only after the email provider accepts the message. |
| `GET` | `/api/messages` | Returns the in-memory messages. Requires header `x-admin-secret` equal to `ADMIN_SECRET`. Otherwise returns `403`. |

Any other path returns `404`.

Example contact request:

```bash
curl -X POST http://localhost:5000/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"subject\":\"Role\",\"message\":\"Hello\"}"
```

On macOS or Linux, use `\` instead of `^` for line continuation.

## How the frontend uses the backend

Only the projects list uses the Render API.

1. `index.html` assigns the Render origin to `window.PORTFOLIO_API`.
2. `js/app.js` calls `GET ${window.PORTFOLIO_API}/api/projects`.
3. If that call does not return a project list within 4 seconds, the browser calls the public GitHub API instead.

The contact form and the projects list both use `window.PORTFOLIO_API`. The form posts to `/api/contact`. To point either request at another API, change that assignment in `index.html` to the origin only, with no `/api` suffix, then deploy the frontend again.

`server.js` enables CORS with `cors()` and does not restrict origins.

## Deploy the frontend on Vercel

1. Push this repository to GitHub.
2. In Vercel, import `D4denzoo/MY-PORTFOLIO`.
3. Set the root directory to the repository root. Do not set it to `backend`.
4. Framework preset: **Other**.
5. Leave the build command empty. There is no build. Vercel should serve `index.html` from the root.
6. Deploy.

After deployment, confirm `window.PORTFOLIO_API` in `index.html` is the Render origin. A later push to the connected branch redeploys the site.

## Deploy the backend on Render

1. Create a **Web Service** and connect the same GitHub repository.
2. Set the root directory to `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add any environment variables from the table above that you intend to use. Do not commit those values.
6. Deploy, then open the service URL. `GET /` should return the health JSON.

If the Render hostname is not `https://denzel-portfolio-api.onrender.com`, update `window.PORTFOLIO_API` in `index.html` and redeploy the frontend.

## Troubleshooting

- **Vercel shows the wrong site or a 404.** The root directory is probably `backend` or another subfolder. Set it to the repository root so `index.html` is served.
- **Render fails immediately or cannot find `package.json`.** The root directory is probably the repository root. Set it to `backend`, where `package.json` and `server.js` are.
- **`npm install` fails on Render.** Check the build log. The install must run in `backend`, and the start command must remain `npm start`.
- **Projects stay empty or fall back to GitHub.** `window.PORTFOLIO_API` must be the Render origin only, for example `https://your-service.onrender.com`, not a path ending in `/api/projects`. The browser gives that request 4 seconds.
- **The form says it cannot deliver the message.** Render logs should contain `Email sending failed` followed by the provider error. Set `EMAIL_PROVIDER=resend` and `RESEND_API_KEY` on Render. `GET /` should show `"provider": "resend"`. A normal Gmail password will not work.
- **Resend accepts the API call but the inbox stays empty.** With `onboarding@resend.dev`, Resend only delivers to the email address on the Resend account. Sign up with `denzelosward109@gmail.com`, or verify a domain and set `CONTACT_FROM` to an address on that domain. Also check Spam.
- **`GET /api/messages` returns 403.** Send the header `x-admin-secret` with the same value as `ADMIN_SECRET`.
- **Browser reports a network or CORS failure.** `server.js` allows all origins. Confirm the frontend URL is the live Render origin, the service is awake, and the path is `/api/projects`.

## Contact

- Email: denzelosward109@gmail.com
- GitHub: [https://github.com/D4denzoo](https://github.com/D4denzoo)
- Location: Dar es Salaam, Tanzania
