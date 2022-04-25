# Fetch all sessions

**URL** : `/sessions/`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```

# Fetch preview sessions

**URL** : `/sessions/preview`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```

# Fetch single session

**URL** : `/sessions/:pk/`

**URL Parameters** : `pk=[integer]` where `pk` is the ID of the session in the
database.

**Method** : `GET`

**Auth required** : YES

**Permissions required** : User is owner of session

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json
{
  "message": "session fetched successfully",
  "status": "success",
  "session": {
    // the metadata for the session including the exercises
    "exercises": [
      {
        // array of objects representing the exercises within the session
      }
    ]
  }
}
```

**Example** :

```json
{
  "status": "success",
  "message": "session fetched successfully",
  "session": {
    "name": "back",
    "description": "a back session",
    "category": "back",
    "session_id": "5",
    "exercises": [
      {
        "name": "bb row",
        "description": "row",
        "exercise_id": "98",
        "category": "back",
        "profile": "short",
        "video": "https://youtube.com/session-exercise-234"
      },
      {
        "name": "bb row",
        "description": "row",
        "exercise_id": "102",
        "category": "back",
        "profile": "short",
        "video": "https://youtube.com/session-exercise-224"
      }
    ]
  }
}
```
