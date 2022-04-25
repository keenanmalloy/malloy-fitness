# Create an Exercise

**URL** : `/exercises/`

**Method** : `POST`

**Authentication required** : YES

## Error Responses

**Code** : `422 Unprocessed Entity`

**Data Constraints**:

```
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(500).allow('').optional(),
  category: Joi.string().required(),
  primary: Joi.array().items(Joi.string(), Joi.number()).required(),
  secondary: Joi.array().items(Joi.string(), Joi.number()).optional(),
  video: Joi.string().allow(null).optional(),
  profile: Joi.string().allow(null).valid('short', 'mid', 'long').optional(),
```

**Content** :

```json
{
  "name": "New Exercise Name",
  "description": "asdfasdfasdf",
  "category": "arms",
  "primary": [1, 2, 3],
  "secondary": [1, 2, 3],
  "video": "https://video.caption.com",
  "profile": "long"
}
```

## Success Responses

**Code** : `201 OK`

**Content** :

```json

```
