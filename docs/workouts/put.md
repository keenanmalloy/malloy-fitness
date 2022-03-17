# Update Workout

**URL** : `/workouts/:pk/`

**Method** : `PUT`

**Auth required** : Yes

**Permissions required** : None

**Data constraints**

Optionally provide name, category and description to update the Workout

```json
{
  "name": "[unicode 3 chars min, 64 chars max]",
  "description": "[unicode 3 chars min, 64 chars max]",
  "category": "[unicode 3 chars min, 64 chars max]"
}
```

**Data example**

```json
{
  "name": "Upper body day",
  "description": "Workout that includes arms, shoulders, chest and back exercises.",
  "category": "Arms"
}
```

## Success Response

**Condition** : If everything is OK and a Workout was updated

**Code** : `200 SUCCESS`

**Content example**

```json
{
  "status": "success",
  "message": "Workout updated successfully",
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

**Condition** : If workout :pk provided does not exist

**Code** : `404 Missing Content`

**Content example**

```json
{
  "status": "error",
  "message": "Workout does not exist",
  "workout": null
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
  "error": "There has been an error processing the length of description"
}
```


# Update exercise in workout

**URL** : `/workouts/:pk/exercises/:pk`

**Method** : `PUT`

**Auth required** : Yes

**Permissions required** : None

**Data constraints**

Optionally provide order and priority to update the exercise

```json
{
  "order": "[number]",
  "priority": "[number]",
}
```

**Data example**

```json
{
  "order": "4",
  "priority": "2",
}
```

## Success Response

**Condition** : If everything is OK and a Exercise was updated

**Code** : `200 SUCCESS`

**Content example**

```json
{
  "status": "success",
  "message": "Exercise updated successfully",
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

### Or

**Condition** : If exercise :pk OR workout :pk provided does not exist

**Code** : `404 Missing Content`

**Content example**

```json
{
  "status": "error",
  "message": "Exercise does not exist",
  "exercise": null
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
  "exercise": null,
  "error": "There has been an error processing the length of description"
}
```
