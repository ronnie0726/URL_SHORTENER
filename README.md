# URL_SHORTENER

1. A RESTful API to upload a URL and response with a shorten url.
2. Redirect to original URLs while users upload a shorten URLs (If the shorten URLs exist and is not expired yet).
```bash
git clone https://github.com/ronnie0726/URL_SHORTENER.git
cd URL_SHORTENER
node server.js
```
```bash
curl -X POST "http://localhost:3000/api/v1/urls" -d "url=<original_url>&expireAt=2022-03-28T08:31:58.398Z"
```
