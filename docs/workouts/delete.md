# Delete Workout

Delete the Workout.

**URL** : `/workouts/:pk/`

**URL Parameters** : `pk=[integer]` where `pk` is the ID of the Workout in the
database.

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : User is Workout Owner

**Data** : `{}`

## Success Response

**Condition** : If the Workout exists.

**Code** : `200 NO CONTENT`

**Content** :

```json
{
  "status": "success",
  "message": "Workout deleted successfully",
  "workout": {}
}
```

## Error Responses

**Condition** : If there was no Workout available to delete.

**Code** : `404 NOT FOUND`

**Content** :

```json
{
  "status": "error",
  "message": "Workout does not exist",
  "workout": null
}
```
