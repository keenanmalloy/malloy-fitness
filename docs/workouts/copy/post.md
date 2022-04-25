# Clone / Copy the workout

**URL** : `/workouts/:pk/copy/`

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : None

## Success Response

**Condition** : If everything is OK and a Workout was cloned

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
