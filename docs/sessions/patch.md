# Update a Session

**URL** : `/sessions/:pk`

**Method** : `PATCH`

**Authentication required** : YES

**Permissions required**: User is owner of session

**Data Constraints**:

```
  started_at: Joi.string().optional(),
  ended_at: Joi.string().optional(),
  session_dt: Joi.string().optional(),
  deload: Joi.boolean().optional(),
```

**Content** :

```json
{
  "started_at": "2022-04-25T14:07:01.725Z",
  "ended_at": "2022-04-25T14:07:01.725Z",
  "session_dt": "2022-04-25T14:07:01.725Z",
  "deload": true
}
```

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```
