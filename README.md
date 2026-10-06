# itelect2-demo-library

The **Library API** — the app we build together in class, one session at a time.

This is the instructor demo project. It runs in parallel with your own
`itelect2-project` (the Task Manager): same concepts, different domain.
Whatever we add here in a lecture, you add the equivalent to yours in the GT.

| Session | We added                                              |
| ------- | ----------------------------------------------------- |
| 1       | Repository, README, .gitignore, index.html            |
| 2       | feature/setup branch, src/app.js, package.json, .env  |
| 3       | src/utils.js - the books array and ES6+ helpers       |
| 4       | src/api.js - async author fetch, custom error class   |
| 5       | Express server, routes/index.js, three GET routes     |
| 6       | Full CRUD on books, cors, morgan, error middleware    |
| 7       | PostgreSQL + Sequelize: Author and Book models, migrations (not wired into routes yet) |
| 8       | Associations, a seeder, and every route rewritten as a real Sequelize query |
| 9       | A User table, bcrypt password hashing, and a JWT handed out at login |
| 10      | verifyToken and requireRole middleware, a book search, and a security audit |
| 11      | MVC refactor: controllers/, one routes file per resource, a thin server.js. **No behaviour changed** |
| 12      | Deployed to Render: a production block in config.cjs, a startup database check, a CORS allow-list |

## Live URL

**https://itelect2-demo-library.onrender.com** -- replace this with the
address Render shows at the top of the service page. Try
`/api/books` on the end of it.

The service is on Render's free plan: after 15 minutes with no requests it
spins down, and the next request takes about a minute to answer.

## Project layout (unchanged since Session 11)

```
server.js                      start up, mount three routers, listen
routes/         auth.js        URL -> controller function. No res, no Sequelize
                books.js
                authors.js
controllers/    authController.js    the handlers: read the request,
                bookController.js    ask the model, write the response
                authorController.js
models/         user.cjs       the tables, their columns, their rules
                book.cjs
                author.cjs
                index.cjs
middleware/     verifyToken.js  functions that run before a handler
                requireRole.js
                errorHandler.js
migrations/     the table definitions, versioned
seeders/        the demo rows
config/         config.cjs -- where Sequelize finds the database
```

`routes/index.js` is gone. Its five book handlers are now
`controllers/bookController.js`, its author handler is
`controllers/authorController.js`, and the URLs are in `routes/books.js` and
`routes/authors.js`.

Each router is mounted at its own prefix, so the paths inside a routes file
are short:

| server.js                              | routes file       | `router.get("/:id")` serves |
| -------------------------------------- | ----------------- | --------------------------- |
| `app.use("/api/auth", authRoutes)`     | routes/auth.js    | /api/auth/:id               |
| `app.use("/api/books", bookRoutes)`    | routes/books.js   | /api/books/:id              |
| `app.use("/api/authors", authorRoutes)`| routes/authors.js | /api/authors/:id            |

## Running it

```
npm install
node server.js
```

The database is not optional. Create `itelect2_library_dev` in pgAdmin, fill in
`.env` (copy `.env.example` and edit it), then:

```
npx sequelize-cli db:migrate     # creates Authors, Books and Users
npx sequelize-cli db:seed:all    # inserts 3 authors, 4 books and 2 users
```

Seeders are not tracked the way migrations are: running `db:seed:all` twice
inserts the rows twice. `npx sequelize-cli db:seed:undo:all` clears them.

As of Session 12 the server also refuses to start when it cannot reach the
database, and prints `Cannot reach the database:` with the reason.

As of Session 9 the server refuses to start without `JWT_SECRET` in `.env`;
as of Session 10 it also refuses one shorter than 32 characters.
Generate your own — never reuse the one in `.env.example`:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running it on Render (Session 12)

`config/config.cjs` has two blocks. Which one is used depends on `NODE_ENV`:

| Where        | NODE_ENV      | Block         | The database comes from |
| ------------ | ------------- | ------------- | ----------------------- |
| your laptop  | not set       | `development` | `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` in `.env` |
| Render       | `production` (Render sets it) | `production` | `DATABASE_URL`, one connection string |

Render service settings: Build Command `npm install`, Start Command
`node server.js`. Environment variables on the service:

| Key            | Value |
| -------------- | ----- |
| `DATABASE_URL` | the database's **Internal** Database URL |
| `JWT_SECRET`   | a new 64-character secret, not the one in your `.env` |
| `CORS_ORIGIN`  | the address of a front end, or leave it out |

`PORT` and `NODE_ENV` are set by Render. Do not add them.

The free plan has no shell, so the tables and the demo rows are created from
your laptop, once, through the database's **External** Database URL. In
PowerShell, in the project root:

```
$env:DATABASE_URL = "<paste the External Database URL>"
npx sequelize-cli db:migrate --env production
npx sequelize-cli db:seed:all --env production
Remove-Item Env:DATABASE_URL
```

Without `--env production` the same commands run against the database on
your laptop and report success.

**`CORS_ORIGIN`** is a comma-separated list of the web pages allowed to read
this API's answers from a browser. It does nothing to Postman, which sends
no `Origin` header and is not a browser.

The two seeded logins, for testing. **On the live URL these are real
accounts on a public API, and their passwords are in this file.** That is
acceptable for a class demo whose data is four book titles, and for nothing
else.

| Email                  | Password       | Role   |
| ---------------------- | -------------- | ------ |
| librarian@library.test | librarian123   | admin  |
| reader@library.test    | member123      | member |

## Endpoints (unchanged since Session 10, now also on the live URL)

"Token" means the request must carry `Authorization: Bearer <token>`, where
the token is the one `POST /api/auth/login` returned.

| Method | Path                | Who may call it   | Success | Failure |
| ------ | ------------------- | ----------------- | ------- | ------- |
| POST   | /api/auth/register  | anyone            | 201     | 400 short password or bad email, 409 email taken |
| POST   | /api/auth/login     | anyone            | 200     | 401 wrong email *or* wrong password |
| GET    | /api/auth/me        | token             | 200     | 401 no token, bad token, expired token |
| GET    | /api/books          | anyone; `?search=` filters by title | 200 | - |
| GET    | /api/books/:id      | anyone            | 200     | 404 |
| GET    | /api/authors        | anyone            | 200     | - |
| POST   | /api/books          | token (any role)  | 201     | 401, 400 blank title |
| PUT    | /api/books/:id      | token (any role)  | 200     | 401, 404 |
| DELETE | /api/books/:id      | token, role admin | 200     | 401, 403 member, 404 |

Every path, status code and response body is the same as Session 10's. The
whole point of a refactor is that this table does not move. `parity.mjs` in
`itelect2-session11` sends 38 requests to both projects and diffs every
answer.

**401 and 403 are different answers.** 401: the API does not know who you
are (no token, or one it cannot verify). 403: it knows exactly who you are,
and your role is not allowed to do this.

**POST and PUT only accept four fields** -- `title`, `publishedDate`,
`available`, `authorId`. Anything else in the body (`id`, `createdAt`) is
ignored, because both calls pass `{ fields: BOOK_FIELDS }`. `BOOK_FIELDS`
now lives in `controllers/bookController.js`.

**A 500 never describes itself to the client.** The real message is printed
in the server terminal; the response says `Something went wrong on the server`.
That decision is now in `middleware/errorHandler.js`.

## What this does *not* do

- **No ownership.** Any logged-in member may edit any book. Only role decides.
- **A role change does not reach a token that already exists.** The role is
  read from the token, not the database, so a demoted admin stays an admin
  until their token expires (one hour).
- **No logout.** A token is valid until `exp`. Changing `JWT_SECRET` is the
  only way to cancel every token at once.
- **No service layer.** The controllers call Sequelize directly. A larger app
  puts a `services/` folder between them; three resources do not need one.

## Where this is going

The Library API keeps growing until the last session. Each row is the lecture
demo; your GT does the same thing to the Task Manager.

Note the numbering: the week number and the session number do not match.
Session 11 ran in Week 14 and Session 12 in Week 15.

| Week | Session | Library API (demo)                                                      | Your GT |
| ---- | ------- | ----------------------------------------------------------------------- | ------- |
| 7    | 7       | PostgreSQL + Sequelize: `Author` and `Book` models, migrations -- **done** | GT7  |
| 8    | 8       | `Book belongsTo Author`; every route a real query; seeders -- **done**   | GT8     |
| 9    | review  | clone fresh, run, re-test everything                                     | Midterm Project (Aug 26) |
| 10   | 9       | `POST /api/auth/register` and `/login` -- bcrypt + JWT -- **done**, see `itelect2-demo-library-session9` | GT9 |
| 11   | 10      | `verifyToken` on write routes; `admin` may DELETE any book -- **done**, see `itelect2-demo-library-session10` | GT10 |
| 14   | 11      | MVC refactor: `models/`, `controllers/`, `routes/` -- **done**, see `itelect2-demo-library-session11` | GT11 |
| 15   | 12      | deploy to Render, live URL in this README -- **done**, this folder       | GT12    |
| 16   | workshop| readiness check against the live URL                                     | -       |
| 17   | demo    | live walkthrough: register -> login -> add book -> delete as admin       | Final Project |
| 18   | review  | no new features -- finals review                                         | MA2 (Oct 30) |

By the last session this repo is a deployed, authenticated, role-aware REST API
with a real relational database behind it -- the same shape as your own project.
