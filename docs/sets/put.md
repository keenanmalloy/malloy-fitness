# Update a Session

**URL** : `/sessions/:pk/sets/:pk/`

**Method** : `PATCH`

**Authentication required** : YES

**Permissions required**: User is owner of session

**Data Constraints**:

```
  weight: Joi.number().optional(),
  repetitions: Joi.number().optional(),
```

**Content** :

```json
{
  "weight": 123,
  "repetitions": 12
}
```

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```
