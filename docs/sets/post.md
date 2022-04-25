# Create a Session

**URL** : `/sessions/`

**Method** : `POST`

**Authentication required** : YES

## Error Responses

**Code** : `422 Unprocessed Entity`

**Data Constraints**:

```
workout_id: Joi.string().required(),
session_dt: Joi.string().optional(),
```

**Content** :

```json
{
  "workout_id": "123",
  "session_dt": "123"
}
```

## Success Responses

**Code** : `201 OK`

**Content** :

```json

```
