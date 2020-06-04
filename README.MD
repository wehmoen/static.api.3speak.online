# 3SPEAK STATIC API

This is the documentation fpr the 3Speak Static API. 
The static API includes exclusively public APIs.


## Response Format

The API responds to all requests in the JSON format.

Example API Response:

```
{
    error: null || {id: String, code: String, title: String, detail: String, meta: Object},
    data: [],
    meta: Object || undefined
}
```

HTTP Response Codes:

- 200 - Everything Okay. 
- 201 - The request has succeeded and a new resource has been created as a result.
- 202 - The request has been received but not yet acted upon.

- 400 - Bad Request. The server could not understand the request due to invalid syntax or parameter.
- 401 - Unauthenticated: The client must authenticate itself to get the requested response.
- 402 - Payment Required: The client must complete a payment to get the requested response.
- 403 - The client does not have access rights to the content. Unlike 401, the users identity is known to the server. 
- 404 - The server can not find the requested resource.
- 405 - Method not allowed.
- 413 - Payload too large. 
- 414 - The URI requested by the client is longer than the server is willing to interpret.
- 418 - I'm a Hiveian. The server refuses the attempt to serve Steemians with HIVE content.
- 429 - Too many requests. Slow down. 
- 451 - Unavailable For Legal Reasons: The client requested a resource that cannot legally be provided, such as a web page censored by a government.

- 500 - Internal Server Error - Oups Something went wrong. 
- 503 - Gateway Timeout. The backend seems to be down.



## `/feed`

The `/feed` apis provide the user with trending, new and individually curated content.

---
### `/feed/new`

Returns a feed of the latest uploaded videos. 

Items per result: 48

#### Parameter: 

`skip` => Skip X number of videos

---
### `/feed/trending`

Returns a feed of trending videos. 


#### Parameter: 

`skip` => Skip X number of videos

---
### `/feed/curated`

Returns a feed of curated videos for the front page. 

#### Parameter: 

`skip` => Skip X number of videos

---
### `/feed/pinned`

Returns a feed of pinned videos for the front page. 

#### Parameter: 

`skip` => Skip X number of videos



