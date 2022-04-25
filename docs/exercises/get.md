# Fetch a list of exercises

**URL** : `/exercises/`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```

# Fetch single exercise

**URL** : `/exercises/:pk/`

**URL Parameters** : `pk=[integer]` where `pk` is the ID of the session in the
database.

**Method** : `GET`

**Auth required** : YES

**Permissions required** : User is owner of exercise OR exercise is public

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content** :

```json

```
