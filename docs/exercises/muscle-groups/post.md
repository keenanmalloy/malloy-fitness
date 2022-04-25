# Adds a muscle-group to an exercise

**URL** : `/exercises/:pk/muscle-group`

**Method** : `POST`

**Authentication required** : YES

## Error Responses

**Code** : `422 Unprocessed Entity`

**Data Constraints**:

```
group: Joi.string().valid('primary', 'secondary').optional(),
muscleGroupId: Joi.alternatives(Joi.string(), Joi.number()).required(),
```

**Content** :

```json
{
  "group": "primary",
  "muscleGroupId": "123"
}
```

## Success Responses

**Code** : `201 OK`

**Content** :

```json

```
