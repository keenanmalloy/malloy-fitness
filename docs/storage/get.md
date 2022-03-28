# Fetch pre-signed Storage URL for S3

**URL** : `/storage/upload`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

## Error Responses

**Code** : `400 File name missing || 400 File type missing`

**Content** :

```json
{
  "status": "error",
  "message": "File type missing"
}
```

## Success Responses

**Code** : `200 OK`

**Content** :

```json
{
  "fields": {
    "Policy": "eyJasdfpcsdfasiMjAasdfaskdlfasdasdf50ZW50LWxlbmd0aC1yYW5nZSIsMCwasdfMjQyODgwMDAwXSxbInN0YXasdfasdfasdfasdffltYWdlLyJdLasdfOS9pbWFnZXMvMjasdfasdfasdfhsLXN0b3JlLdfasdfasdfasg328o72tyf8gaksdjhgfaskjdhgf293fgkajsudyhgf89237gkufdyawhgdjkfkahgsdkjfhga98327gfkigsdfzNF9yZXF1Zasdfasdfasdftei1fdsYXRlIjoiMjAasdfasdfasdfayODU3Wasdf9XX0=",
    " X-Amz-Algorithm": "AWS1-HMAC-SHA512",
    "X-Amz-Credential": "FGKHSDFKHJSDFKJHFKJH/2342747873/us-east-4/s3/aws1_request",
    "X-Amz-Date": "20200327T182857Z",
    "X-Amz-Signature": "s239827nf32987fn234f2u3bnf492i3",
    "bucket": "trckd-dev",
    "key": "/9/images/2021-02-22/this-is-a-file.png1287dn281h92"
  },
  "url": "https://s3.us-west-2.amazonaws.com/trckd-dev"
}
```

With the "key" we can construct the URL to fetch the image.
Example:

```
const url = https://cdn.trckd.ca/${response.fields.key}
```
