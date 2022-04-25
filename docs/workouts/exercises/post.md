# Add exercise to workout

**URL** : `/workouts/:pk/exercises/`

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : Owner of workout

**Data example**

```json
{
  "order": 5,
  "priority": 3,
  "exerciseId": 4
}
```

## Success Response

**Condition** : If everything is OK and a Exercise was added

**Code** : `200 SUCCESS`

**Content example**

```json
{
  "status": "success",
  "message": "Exercise added successfully",
  "exercise": {
    // data from the exercise
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
  "exercise": null,
  "error": "Unprocessable Entity"
}
```
