# User Management API

This API allows for the management of user data and notes, including creating, updating, deleting users, and saving/retrieving notes. It uses Firebase Firestore as the database and Firebase Authentication for user management.

## DB Structure

### **Users Collection**

Each user document in the `users` collection represents a registered user. The structure of each document is as follows:

```json
{
  "name": "John Doe", // string, user's full name
  "email": "john.doe@example.com", // string, user's email
  "gender": "Male", // enum, 'Male' or 'Female'
  "age": 25, // number, user's age (must be 18 or older)
  "createdAt": "2024-01-01T00:00:00Z" // string, ISO formatted date of user creation
}
```

### **Notes Collection**

Each note document in the notes collection represents a note created by a user. The structure of each document is as follows:

```json
{
  "title": "Meeting Notes", // string, title of the note
  "content": "Important discussion points from the meeting", // string, content of the note
  "userId": "user-uid-12345", // string, userId of the note's owner (reference to the users collection)
  "pinned": false, // boolean, indicates if the note is pinned
  "reminder": "2024-01-01T12:00:00Z", // string, ISO formatted date (optional), reminder for the note
  "createdAt": "2024-01-01T12:00:00Z" // string, ISO formatted date of note creation
}
```

### **API Endpoints**

1\. **Create User**

**Endpoint**: `POST https://newuser-zuqlkkqq5a-uc.a.run.app`

**Request body**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "gender": "Male",
  "age": 25
}
```

**Response**:

```json
{
  "uid": "287skQhwyvRNy...",
  "message": "User registered successfully"
}
```

2\. **Update User**

**Endpoint**: `PUT https://updateuser-zuqlkkqq5a-uc.a.run.app`

**Request header**:

**Content-Type: application/json**

**Authorization: Bearer JWT Token**

We can hit the loginUser endpoint and get this token or use client Firebase SDK

**Request body**:

```json
{
  "name": "Jane Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "gender": "Female",
  "age": 25
}
```

**Response**:

```json
{
  "message": "User updated successfully",
  "updates": {
    "name": "Updated Name"
  }
}
```

3\. **Delete User**

**Endpoint**: `DELETE https://deleteuser-zuqlkkqq5a-uc.a.run.app`

**Request header**:

**Content-Type: application/json**

**Authorization: Bearer JWT Token**

We can hit the loginUser endpoint and get this token or use client Firebase SDK

**Response**:

```json
{
  "message": "User deleted successfully"
}
```

4\. **Save Note**

**Endpoint**: `POST https://savenotes-zuqlkkqq5a-uc.a.run.app`

**Request header**:

**Content-Type: application/json**

**Authorization: Bearer JWT Token**

We can hit the loginUser endpoint and get this token or use client Firebase SDK

**Request body**:

```json
{
  "title": "Meeting Notes", // string, title of the note
  "content": "Important discussion points from the meeting", // string, content of the note
  "userId": "user-uid-12345", // string, userId of the note's owner (reference to the users collection)
  "pinned": false, // boolean, indicates if the note is pinned
  "reminder": "2024-01-01T12:00:00Z", // string, ISO formatted date (optional), reminder for the note
  "createdAt": "2024-01-01T12:00:00Z" // string, ISO formatted date of note creation
}
```

**Response**:

```json
{
  "message": "Note saved successfully",
  "note": {
    "title": "Meeting Notes",
    "content": "Important discussion points from the meeting",
    "pinned": false,
    "reminder": "2024-01-01T12:00:00Z",
    "userId": "user-uid-12345",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

5\. **Get Notes**

**Endpoint**: `GET https://getnotes-zuqlkkqq5a-uc.a.run.app`

**Request header**:

**Content-Type: application/json**

**Authorization: Bearer JWT Token**

We can hit the loginUser endpoint and get this token or use client Firebase SDK

**Response**:

```json
{
  "notes": [
    {
      "id": "note-id-12345",
      "title": "Meeting Notes",
      "content": "Important discussion points from the meeting",
      "pinned": false,
      "reminder": "2024-01-01T12:00:00Z",
      "userId": "user-uid-12345",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

6\. **Login User**

**Endpoint**: `POST https://loginuser-zuqlkkqq5a-uc.a.run.app`

**Request Body**:

```json
{
  "email": "test@example.com",
  "password": "pass123"
}
```

**Response**:

```json
{
  "message": "Login successful",
  "customToken": "eyJhbGc..."
}
```

7\. **Get JWT Token**

Use the token from loginUser to get the JWT Token

**Endpoint**: `POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyA83Wa7lZahFb2JrdsnZKm8V9rX3lH3daE`

**Request header**:

**Content-Type: application/json**

**Request Body**:

```json
{
  "token": "eyJhbGciOi...",
  "returnSecureToken": true
}
```

**Response**:

```json
{
  "kind": "identitytoolkit#VerifyCustomTokenResponse",
  "idToken": "eyJhbGciOi...",
  "refreshToken": "AMf-vBzQNTwBaBeYg...",
  "expiresIn": "3600",
  "isNewUser": false
}
```
