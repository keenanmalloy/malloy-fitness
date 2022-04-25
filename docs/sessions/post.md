# Create a Set

**URL** : `/sessions/:pk/sets/`

**Method** : `POST`

**Authentication required** : YES

**Permissions required**: User is owner of session

## Error Responses

**Code** : `422 Unprocessed Entity`

**Data Constraints**:

```
  exercise_id: Joi.number().required(),
  repetitions: Joi.number().optional(),
  weight: Joi.number().optional(),
  set_order: Joi.number().optional(),
```

**Content** :

```json
{
  "exercise_id": 123,
  "repetitions": 12,
  "weight": 123,
  "set_order": 1
}
```

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```
