# AutoVerse: 3D Virtual Car Showroom

Full-stack college mini-project: **React + Vite + React Three Fiber** frontend, **Flask + PostgreSQL** backend with JWT auth.
All car data is illustrative sample data (not official, not live, no manufacturer endorsement).

## Features
Home, 3D Showroom (grid + 3D hall), 3D Customizer (paint, finish, wheels, rotate/zoom, save), Car Details, Compare (2-3 cars, best-value highlight, Recharts), Register/Login/Dashboard (favourites, saved configs, recently viewed), About + Contact/Feedback (stored in PostgreSQL). Demo fallback data is used if the API is down and a banner clearly says so.

## Structure
```
autoverse/
  backend/   app.py config.py extensions.py models.py seed_data.py requirements.txt .env.example routes/
  frontend/  src/{components,pages,context,hooks,data} public/{models,images} netlify.toml
  render.yaml
```

## Local setup
**Prerequisites:** Node 18+, Python 3.10+, PostgreSQL (or skip it: without `DATABASE_URL` the API falls back to local SQLite).

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                  # edit DATABASE_URL and secrets
createdb autoverse                                    # PostgreSQL
python app.py                                         # creates tables, seeds 8 cars, serves :5000
```
Manual seed: `flask --app app seed`. Optional migrations: `flask --app app db init && flask --app app db migrate -m "init" && flask --app app db upgrade`
(if you use migrations, set up the DB with them on a fresh database instead of relying on the startup `create_all`).

### Frontend
```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

## API
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | /api/auth/register | | full_name, email, password, confirm_password |
| POST | /api/auth/login | | returns access_token |
| GET | /api/auth/me | JWT | |
| GET | /api/cars | | q, category, sort (name, price_asc, price_desc), page, per_page |
| GET | /api/cars/:id | | |
| GET | /api/categories | | |
| GET/POST | /api/favorites | JWT | POST {car_id} |
| DELETE | /api/favorites/:id | JWT | favourite id |
| GET/POST | /api/configurations | JWT | car_id, body_color, wheel_color, paint_finish, configuration_name |
| DELETE | /api/configurations/:id | JWT | |
| POST | /api/contact | | name, email, subject, message |
| GET | /api/health | | DB check |

## Deployment
1. **GitHub:** `git init && git add . && git commit -m "Initial AutoVerse project" && git remote add origin <url> && git push -u origin main` (`.env` is git-ignored).
2. **Database + backend (Render):** create a PostgreSQL instance, then a Python Web Service with root dir `backend`, build `pip install -r requirements.txt`, start `gunicorn app:app`. Env vars: `DATABASE_URL` (internal URL), `JWT_SECRET_KEY`, `SECRET_KEY`, and `FRONTEND_URL` (your Netlify URL, no trailing slash). Tables and seed data are created on first boot; check `/api/health`. (`render.yaml` is an optional blueprint.)
3. **Frontend (Netlify):** base directory `frontend`, build `npm run build`, publish `dist`, env `VITE_API_URL=https://<your-api>.onrender.com/api`. SPA redirects are in `public/_redirects` and `netlify.toml`.
   Render free instances sleep; the first request can take ~1 minute.

## 3D models and photos
See `frontend/public/models/README.md` and `frontend/public/images/README.md`. A procedural fallback car is used until you add licensed GLB files.

## Screenshots
Add screenshots to `docs/` and link them here after running the app.
