
# MyOTT

### Overview
This project aims to enhance an existing OTT (Over-the-Top) platform with a new feature called "My List," allowing users to save their favorite movies and TV shows to a personalized list. The feature requires backend services for managing the user's list, including adding, removing, and listing saved items.

### Technical Stack
| Backend  | Database     | Caching     | API Testing |
| ---------- | -------- | ------------ | ----------- |
| Node.js              | MongoDB          | Node Caching             | Jest                   |
| Express.js           |                  | Express API              | Postman API            |
|                      |                  |                          |                        |
|                      |                  |                          |                        |


### Consuming the MyList API
BASE_URL: [MyList API for OTT Platform](https://myott.onrender.com)
To interact with the "MyList" feature, you can use the following endpoints:

<blockquote>
  
  #### Endpoints
  GET ALL USERS -> /api/users <br>
  GET, PUT, DELETE USER -> /api/users/:userId <br>
  POST USER (CREATE) -> /api/users <br>
  DELETE FAVORITE ITEM -> /api/users/:userId/favorites/:itemId
  
</blockquote>