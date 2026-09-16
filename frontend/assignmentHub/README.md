# Assignment Hub Frontend

React 19 and Vite client for Assignment Hub, with separate student and lecturer dashboards.

## Development

```bash
npm ci
cp .env.example .env
npm run dev
```

Run `npm run lint` and `npm run build` before opening a pull request.

## Deployment

Vercel proxies `/api` and `/uploads` to the backend so authentication cookies remain
first-party. In production, leave `VITE_API_URL` unset or set it to `/api`. Update
`vercel.json` whenever the backend hostname changes.
