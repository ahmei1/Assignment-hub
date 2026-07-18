# Assignment Hub — API Contract

Base URL: `http://localhost:5000`
All API routes are prefixed with `/api`.

## Conventions

- Every response uses the envelope: `{ "success": boolean, "message": string, "data": any }`.
  (On errors, `data` is omitted and `message` describes the problem.)
- **Auth uses an httpOnly cookie.** After `login`/`register` the server sets a `token` cookie.
  From the frontend you only need `axios` configured with `withCredentials: true` — no manual
  token handling. (A `token` is also returned in the body as a fallback for tools like Postman;
  it can be sent as `Authorization: Bearer <token>`.)
- `role` is always returned **lowercase** (`"student"` / `"lecturer"`) to match the frontend.
- Dates are ISO 8601 strings.
- File uploads use `multipart/form-data`. Uploaded files are served from `/uploads/<filename>`.
  Allowed types: pdf, doc(x), txt, zip, rar, ppt(x), xls(x), png, jpg(jpeg). Max size: 10 MB.

---

## Auth — `/api/auth`

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/register` | public | `{ name, email, password, role }` — role: `"student"` \| `"lecturer"` |
| POST | `/login` | public | `{ email, password }` |
| POST | `/logout` | public | — (clears cookie) |
| GET | `/me` | cookie | — |

`user` object shape: `{ id, name, email, role }`.

**Login/Register response**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "user": { "id": 3, "name": "John Doe", "email": "student@test.com", "role": "student" },
    "token": "eyJhbGci..."
  }
}
```

---

## Courses — `/api/courses` (all require auth)

| Method | Endpoint | Role | Notes |
|--------|----------|------|-------|
| GET | `/` | any | Student → enrolled courses; Lecturer → owned courses |
| GET | `/browse?search=` | student | Courses the student is NOT yet enrolled in (search by code/name) |
| GET | `/:id` | member | Course detail + its assignments |
| POST | `/` | lecturer | `{ name, code, description? }` |
| POST | `/enroll` | student | `{ code }` or `{ courseId }` |
| POST | `/:id/enroll` | student | enroll by id in URL |

**Course card shape** (used by `MyCourses.jsx`):
```json
{ "id": 1, "name": "Database Administration", "code": "CS301",
  "description": "...", "lecturer": "Dr. Smith", "lecturerId": 1,
  "assignmentsCount": 2, "studentsCount": 2, "createdAt": "..." }
```

`GET /:id` also includes an `assignments: [{ id, title, description, dueDate, fileUrl, submissionsCount }]` array.

---

## Assignments — `/api/assignments` (all require auth)

| Method | Endpoint | Role | Body |
|--------|----------|------|------|
| GET | `/?courseId=` | any | Student → assignments in enrolled courses (+ `submissionStatus`); Lecturer → own (+ `submissionsCount`) |
| GET | `/:id` | member | detail |
| POST | `/` | lecturer | multipart: `title, description, dueDate, courseId, file?` |
| PUT | `/:id` | lecturer owner | multipart: any of `title, description, dueDate, courseId, file` |
| DELETE | `/:id` | lecturer owner | — |

**Assignment shape**
```json
{ "id": 1, "title": "ER Diagram Design", "description": "...",
  "dueDate": "2026-07-16T...", "fileUrl": null, "courseId": 1,
  "course": { "id": 1, "name": "Database Administration", "code": "CS301" },
  "lecturer": { "id": 1, "name": "Dr. Smith" }, "createdAt": "...",
  "submissionStatus": "pending",   // student view: pending|submitted|graded|late
  "submissionId": null }           // student view: their submission id if any
```
(Lecturer view replaces the last two fields with `"submissionsCount": <number>`.)

---

## Submissions — `/api/submissions` (all require auth)

| Method | Endpoint | Role | Body |
|--------|----------|------|------|
| POST | `/` | student | multipart: `assignmentId, notes?, file` (required). Re-submitting replaces the previous file. Auto-marks `late` if past due date. |
| GET | `/?assignmentId=` | any | Lecturer → submissions for own assignments; Student → own submissions |
| GET | `/:id` | owner/lecturer | detail |

**Submission shape**
```json
{ "id": 2, "fileUrl": "http://localhost:5000/uploads/...txt", "notes": "...",
  "status": "submitted", "grade": null, "submittedAt": "...",
  "assignment": { "id": 3, "title": "React Portfolio", "dueDate": "...", "course": { "id": 2, "name": "Web Development" } },
  "student": { "id": 3, "name": "John Doe", "email": "student@test.com" } }
```

---

## Dashboards — `/api/dashboard` (all require auth)

### `GET /student` (student)
```json
{ "stats": { "courses": 2, "assignments": 3, "submitted": 1, "dueSoon": 1 },
  "deadlines": [ { "id": 1, "assignment": "ER Diagram Design", "course": "Database Administration", "dueDate": "...", "status": "submitted" } ],
  "progress": 33 }
```

### `GET /lecturer` (lecturer)
```json
{ "stats": { "courses": 2, "assignments": 3, "submissions": 1 },
  "recentAssignments": [ { "id": 3, "title": "React Portfolio", "course": "Web Development", "dueDate": "...", "submissionsCount": 0 } ],
  "recentSubmissions": [ { "id": 1, "student": "John Doe", "assignment": "ER Diagram Design", "status": "submitted", "submittedAt": "..." } ] }
```

---

## Test accounts (from seed)

| Role | Email | Password |
|------|-------|----------|
| Lecturer | `lecturer@test.com` | `password123` |
| Lecturer | `justin@test.com` | `password123` |
| Student | `student@test.com` | `password123` |
| Student | `jane@test.com` | `password123` |

---

## Frontend setup (React + axios)

Install axios, then create a shared client:

```js
// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends/receives the httpOnly auth cookie
});

export default api;
```

Add to `frontend/assignmentHub/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Example calls:
```js
// login
const { data } = await api.post("/auth/login", { email, password });
login(data.data.user); // store user in AuthProvider

// rehydrate on app load / refresh
const { data } = await api.get("/auth/me");

// create assignment with a file
const form = new FormData();
form.append("title", title);
form.append("description", description);
form.append("dueDate", dueDate);
form.append("courseId", courseId);
if (file) form.append("file", file);
await api.post("/assignments", form);

// submit an assignment
const form = new FormData();
form.append("assignmentId", assignmentId);
form.append("notes", notes);
form.append("file", file);
await api.post("/submissions", form);
```

> Note: since auth is a cookie, on logout call `POST /api/auth/logout` (clears the cookie)
> in addition to clearing local user state.
