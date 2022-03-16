# Fetch all workouts

**URL** : `/workouts/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json
{
  "status": "success",
  "message": "Workouts fetched successfully",
  "workouts": [
    {
      "name": "upper body",
      "description": "a back workout",
      "category": "back",
      "workout_id": "5"
    },
    {
      "name": "lower body",
      "description": "a leg workout",
      "category": "legs",
      "workout_id": "6"
    }
  ]
}
```

# Fetch single workout

**URL** : `/workouts/:pk/`

**URL Parameters** : `pk=[integer]` where `pk` is the ID of the Workout in the
database.

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json
{
  "message": "Workout fetched successfully",
  "status": "success",
  "workout": {
    // the metadata for the workout including the exercises
    "exercises": [
      {
        // array of objects representing the exercises within the workout
      }
    ]
  }
}
```

**Example** :

```json
{
  "status": "success",
  "message": "Workout fetched successfully",
  "workout": {
    "name": "back",
    "description": "a back workout",
    "category": "back",
    "workout_id": "5",
    "exercises": [
      {
        "name": "bb row",
        "description": "row",
        "exercise_id": "98",
        "category": "back",
        "profile": "short",
        "video": "https://youtube.com/workout-exercise-234"
      },
      {
        "name": "bb row",
        "description": "row",
        "exercise_id": "102",
        "category": "back",
        "profile": "short",
        "video": "https://youtube.com/workout-exercise-224"
      }
    ]
  }
}
```
