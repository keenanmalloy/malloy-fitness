# Create Workout

**URL** : `/workouts/`

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : None

**Data constraints**

Provide name, category and array of exercise IDs for the Workout to be created.

```json
{
  "name": "*REQUIRED* [unicode 3 chars min, 64 chars max]",
  "description": "*REQUIRED* [unicode 250 chars max]",
  "category": "[unlimited chars]",
  "exercises": "*REQUIRED* [Array of objects with keys of id, priority, and order]"
}
```

**Data example**

```json
{
  "name": "Upper body day",
  "description": "Workout that includes arms, shoulders, chest and back exercises.",
  "category": "Arms",
  "exercises": [
    { "id": 1, "order": 5, "priority": 2 },
    { "id": 2, "order": 5, "priority": 1 },
    { "id": 3, "order": 4, "priority": 1 },
    { "id": 4, "order": 1, "priority": 1 },
    { "id": 5, "order": 2, "priority": 1 }
  ]
}
```

## Success Response

**Condition** : If everything is OK and a Workout was created

**Code** : `200 SUCCESS`

**Content example**

```json
{
  "status": "success",
  "message": "Workout created successfully",
  "workout": {
    // data from the workout
  }
}
```

## Error Responses

**Condition** : If Data provided was not correct.

**Code** : `422 Unprocessable Entity response`

**Content example**

```json
{
  "status": "error",
  "message": "Cannot understand request body, X is missing from the request",
  "workout": null,
  "error": "Unprocessable Entity"
}
```

### Or

**Condition** : If unknown error caused by server.

**Code** : `500 BAD REQUEST`

**Content example**

```json
{
  "status": "error",
  "message": "Database error",
  "workout": null,
  "error": "There has been an error processing the foreign key id of the exercise."
}
```
