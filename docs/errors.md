# Authentication Errors

**Status** : `403 Unauthorized`

**Meaning** : The user is Authenticated but does not have the required permissions.

This can happen if the user is not the owner of the resource or does not have the correct role.

**Content** :

```json
{
  "role": "user",
  "message": "Unauthorized"
}
```

**Status** : `401 Unauthenticated`

**Meaning** :

- The user is missing their session token. This can happen if the user is not logged in or if the session has expired.
- The session token is stored in the browsers memory and can be checked as a cookie in the application tab. The cookie name is called "token".

**Content** :

```json
{
  "role": "user",
  "message": "Please log in"
}
```
