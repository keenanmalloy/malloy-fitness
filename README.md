# REST API Docs

### Muscle Groups

Endpoints for viewing and manipulating muscle-groups.

- [Gets all muscle groups](docs/muscle-groups/get.md) : `GET /muscle-groups/`
- [Get a single muscle group](docs/muscle-groups/get.md) : `GET /muscle-groups/:pk/`
- [Create a muscle group](docs/muscle-groups/post.md) : `POST /muscle-groups/`
- [Update a muscle group](docs/muscle-groups/put.md) : `PUT /muscle-groups/:pk`
- [Delete a muscle group](docs/muscle-groups/delete.md) : `DELETE /muscle-groups/:pk`

### Workouts

Endpoints for viewing and manipulating workouts.

- [Gets all workouts](docs/workouts/get.md) : `GET /workouts/`
- [Get a single workout](docs/workouts/get.md) : `GET /workouts/:pk/`
- [Get a single workout exercise](docs/workouts/exercises/get.md) : `GET /workouts/:pk/exercises/:pk/`
- [Create a workout](docs/workouts/post.md) : `POST /workouts/`
- [Update a workout](docs/workouts/put.md) : `PUT /workouts/:pk/`
- [Delete a workout](docs/workouts/delete.md) : `DELETE /workouts/:pk/`
- [Add an exercise to a workout](docs/workouts/post.md) : `POST /workouts/:pk/exercises/`
- [Update an exercise order / priority in a workout](docs/workouts/put.md) : `PUT /workouts/:pk/exercises/:pk/`
- [Remove an exercise from a workout](docs/workouts/delete.md) : `DELETE /workouts/:pk/exercises/:pk/`
- [Start workout](docs/workouts/start/patch.md) : `PATCH /workouts/:pk/start`
- [End workout](docs/workouts/end/patch.md) : `PATCH /workouts/:pk/end`
- [Clone a workout](docs/workouts/post.md) : `POST /workouts/:pk/copy`

### Exercises

Endpoints for viewing and manipulating exercises.

- [Gets all exercises](docs/exercises/get.md) : `GET /exercises/`
- [Get a single exercise](docs/exercises/get.md) : `GET /exercises/:pk/`
- [Create an exercise](docs/exercises/post.md) : `POST /exercises/`
- [Update an exercise](docs/exercises/put.md) : `PUT /exercises/:pk/`
- [Delete an exercise](docs/exercises/delete.md) : `DELETE /exercises/:pk/`
- [Add a muscle-group to an exercise](docs/exercises/muscle-groups/post.md) : `POST /exercises/:pk/muscle-group`
- [Removes a primary muscle-group from an exercise](docs/exercises/muscle-groups/delete.md) : `DELETE /exercises/:pk/muscle-group/:pk/primary`
- [Removes a secondary muscle-group from an exercise](docs/exercises/muscle-groups/delete.md) : `DELETE /exercises/:pk/muscle-group/:pk/secondary`

### Sets

Endpoints for viewing and manipulating sets.

- [Get all sets in a workout](docs/sets/get.md) : `GET /workouts/:pk/sets/`
- [Get sets in a workout by exercise](docs/sets/get.md) : `GET /workouts/:pk/exercise/:pk/sets/`
- [Create a set](docs/sets/post.md) : `POST /workouts/:pk/sets/`
- [Update a set](docs/sets/put.md) : `PUT /workouts/:pk/sets/:pk/`
- [Delete a set in a workout](docs/sets/delete.md) : `DELETE /workouts/:pk/sets/:pk`
- [Delete all sets in a workout by exercise](docs/sets/delete.md) : `DELETE /workouts/:pk/exercise/:pk/sets/`

### Auth

Endpoints for authentication.

- [Register / logs in user via google oauth provider](docs/auth/get.md) : `GET /auth/providers/google/`
- [Fetches active users session](docs/auth/get.md) : `GET /auth/me/`
- [Logout user from session](docs/auth/logout/post.md) : `POST /auth/logout/`

### Storage

Endpoints for storage.

- [Get presigned uploadable URL from AWS](docs/storage/get.md) : `GET /storage/upload`
