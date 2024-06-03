### Postman Documentation

#### Base URL

```
http://localhost:3000
```

#### I. User CRUD Operations

##### 1. Create User

**Endpoint:** `/users`
**Method:** `POST`
**Description:** Creates a new user.
**Body:**

```json
{
  "username": "johndoe",
  "password": "password123",
  "email": "johndoe@example.com"
}
```

**Responses:**

- **201 Created:** User successfully created.
- **400 Bad Request:** Invalid data.

##### 2. Get All Users

**Endpoint:** `/users`
**Method:** `GET`
**Description:** Retrieves all users.
**Responses:**

- **200 OK:** Returns a list of users.
- **401 Unauthorized:** Invalid or missing token.

##### 3. Get User by ID

**Endpoint:** `/users/:id`
**Method:** `GET`
**Description:** Retrieves a user by ID.
**Params:**

- **id:** User ID
  **Responses:**
- **200 OK:** Returns the user.
- **401 Unauthorized:** Invalid or missing token.
- **404 Not Found:** User not found.

##### 4. Update User

**Endpoint:** `/users/:id`
**Method:** `PUT`
**Description:** Updates a user's information.
**Params:**

- **id:** User ID
  **Body:**

```json
{
  "email": "johnupdated@example.com",
  "isPremium": true
}
```

**Responses:**

- **200 OK:** User successfully updated.
- **400 Bad Request:** Invalid data.
- **401 Unauthorized:** Invalid or missing token.
- **404 Not Found:** User not found.

##### 5. Delete User

**Endpoint:** `/users/:id`
**Method:** `DELETE`
**Description:** Deletes a user.
**Params:**

- **id:** User ID
  **Responses:**
- **200 OK:** User successfully deleted.
- **401 Unauthorized:** Invalid or missing token.
- **404 Not Found:** User not found.

#### II. Authentication

##### 1. Register User

**Endpoint:** `/auth/register`
**Method:** `POST`
**Description:** Registers a new user.
**Body:**

```json
{
  "username": "johndoe",
  "password": "password123",
  "email": "johndoe@example.com"
}
```

**Responses:**

- **201 Created:** User successfully registered.
- **400 Bad Request:** Invalid data.

##### 2. Login User

**Endpoint:** `/auth/login`
**Method:** `POST`
**Description:** Logs in a user.
**Body:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Responses:**

- **200 OK:** Returns the JWT token.
- **401 Unauthorized:** Invalid credentials.

##### 3. Forgot Password

**Endpoint:** `/auth/forgot-password`
**Method:** `POST`
**Description:** Sends a password reset email.
**Body:**

```json
{
  "email": "johndoe@example.com"
}
```

**Responses:**

- **200 OK:** Password reset email sent.
- **404 Not Found:** User not found.

#### III. App Settings (Example)

##### 1. Get App Settings

**Endpoint:** `/app-settings`
**Method:** `GET`
**Description:** Retrieves the app settings.
**Responses:**

- **200 OK:** Returns the app settings.
- **401 Unauthorized:** Invalid or missing token.

##### 2. Update App Settings

**Endpoint:** `/app-settings`
**Method:** `PATCH`
**Description:** Updates the app settings.
**Body:**

```json
{
  "aiSelected": "mistral",
  "modelForMistral": "open-mixtral-8x7b",
  "modelForOpenAI": "text-davinci-003",
  "modelForClaude": "claude-3-haiku-20240307"
}
```

**Responses:**

- **200 OK:** App settings successfully updated.
- **400 Bad Request:** Invalid data.
- **401 Unauthorized:** Invalid or missing token.

### React Native Integration

#### 1. Install Dependencies

In your React Native project, install the necessary dependencies for making HTTP requests and handling JWT tokens.

```bash
npm install axios @react-native-async-storage/async-storage
```

#### 2. Create API Service

Create a service file to manage API requests.

**services/api.js**

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (username, password, email) => {
  return api.post('/auth/register', { username, password, email });
};

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  const token = response.data.token;
  await AsyncStorage.setItem('token', token);
  return response.data;
};

export const getUsers = async () => {
  return api.get('/users');
};

export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};

export const updateUser = async (id, data) => {
  return api.patch(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`);
};

export const getAppSettings = async () => {
  return api.get('/app-settings');
};

export const updateAppSettings = async (data) => {
  return api.patch('/app-settings', data);
};
```

#### 3. Using the API in React Native Components

You can now use the API service in your React Native components.

**Example: Login Screen**

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { login } from './services/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigation.navigate('Home');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

export default LoginScreen;
```

**Example: User List Screen**

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getUsers } from './services/api';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.username}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default UserListScreen;
```
