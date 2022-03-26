# URL_SHORTENER

1. A RESTful API to upload a URL and response with a shorten url.
2. Redirect to original URLs while users upload a shorten URLs (If the shorten URLs exist and is not expired yet).
3. 操作步驟
```bash
git clone https://github.com/ronnie0726/URL_SHORTENER.git
cd URL_SHORTENER
node server.js
```
4. 測試（POST)
```bash
curl -X POST "http://localhost:3000/api/v1/urls" -d "url=<original_url>&expireAt=2022-03-28T08:31:58.398Z"

#response
{"_id":"623e98f4017b4d46d0000001","shortUrl":"http://localhost:3000/623e98f4017b4d46d0000001"}
```
4. 測試（GET)
```bash
curl -X GET "http://localhost:3000/623e98f4017b4d46d0000001"

#response
Redirecting to <original_url>
```
