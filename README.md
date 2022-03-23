# REST API Docs

### Muscle Groups

Endpoints for viewing muscle-groups.

- [Gets all muscle groups](docs/muscle-groups/get.md) : `GET /muscle-groups/`
- [Get a single muscle group](docs/muscle-groups/get.md) : `GET /muscle-groups/:pk/`

### Workouts

Endpoints for viewing and manipulating workouts.

- [Gets all workouts](docs/workouts/get.md) : `GET /workouts/`
- [Get a single workout](docs/workouts/get.md) : `GET /workouts/:pk/`
- [Create a workout](docs/workouts/post.md) : `POST /workouts/`
- [Update a workout](docs/workouts/put.md) : `PUT /workouts/:pk/`
- [Delete a workout](docs/workouts/delete.md) : `DELETE /workouts/:pk/`

- [Add an exercise to a workout](docs/workouts/post.md) : `POST /workouts/:pk/exercises/`
- [Update an exercise order / priority in a workout](docs/workouts/put.md) : `PUT /workouts/:pk/exercises/:pk/`
- [Remove an exercise from a workout](docs/workouts/delete.md) : `DELETE /workouts/:pk/exercises/:pk/`

### Exercises

Endpoints for viewing and manipulating exercises.

- [Gets all exercises](docs/exercises/get.md) : `GET /exercises/`
- [Get a single exercise](docs/exercises/get.md) : `GET /exercises/:pk/`
- [Create an exercise](docs/exercises/post.md) : `POST /exercises/`
- [Update an exercise](docs/exercises/put.md) : `PUT /exercises/:pk/`
- [Delete an exercise](docs/exercises/delete.md) : `DELETE /exercises/:pk/`

### Sets

Endpoints for viewing and manipulating sets.

- [Get all sets in a workout](docs/sets/get.md) : `GET /workouts/:pk/sets/`
- [Get sets in a workout by exercise](docs/sets/get.md) : `GET /workouts/:pk/exercise/:pk/sets/`
- [Create a set](docs/sets/post.md) : `POST /workouts/:pk/sets/`
- [Update a set](docs/sets/put.md) : `PUT /workouts/:pk/sets/:pk/`
- [Delete all sets in a workout by exercise](docs/sets/delete.md) : `DELETE /workouts/:pk/exercise/:pk/sets/`

### Auth

Endpoints for authentication.

- [Register / logs in user via google oauth provider](docs/auth/get.md) : `GET /auth/providers/google/`
- [Fetches active users session](docs/auth/get.md) : `GET /auth/me/`
