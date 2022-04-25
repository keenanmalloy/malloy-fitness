# Update exercise metadata in workout

**URL** : `/workouts/:pk/exercises/:pk`

**Method** : `PATCH`

**Auth required** : Yes

**Permissions required** : Owner of workout

**Data constraints**

```json
notes: Joi.string().optional(),
sets: Joi.string().optional(),
repetitions: Joi.string().optional(),
reps_in_reserve: Joi.string().optional(),
rest_period: Joi.string().optional(),
```

**Data example**

```json
{
  "notes": "My notes",
  "sets": "2",
  "repetitions": "2",
  "reps_in_reserve": "2",
  "rest_period": "3"
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
