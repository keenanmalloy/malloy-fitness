# Update an Exercise

**URL** : `/exercises/:pk/`

**Method** : `PUT`

**Authentication required** : YES

**Permissions required**: User is owner of session

**Data Constraints**:

```
  name: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(500).allow('').optional(),
  category: Joi.string().optional(),
  video: Joi.string().allow(null).optional(),
  profile: Joi.string().allow(null).valid('short', 'mid', 'long').optional(),
```

**Content** :

```json
{
  "name": "New Exercise Name",
  "description": "asdfasdfasdf",
  "category": "arms",
  "video": "https://video.caption.com",
  "profile": "long"
}
```

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```
