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
  "priority": "[number]"
}
```

**Data example**

```json
{
  "order": "4",
  "priority": "2"
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
