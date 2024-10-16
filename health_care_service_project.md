# Health Care Service Project

This project is a Health Care Service application that provides user authentication, service management, and integration with Redis for caching.

---

## Getting Started Without Docker

If you don't have Docker installed, you can set up the project locally using Node.js. Follow the steps below:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **MongoDB**: Install and run MongoDB on your local machine. You can find installation instructions [here](https://docs.mongodb.com/manual/installation/).
- **Redis**: Install Redis on your local machine. Follow the instructions [here](https://redis.io/docs/getting-started/installation/).

### Installation Steps

1. **Clone the Repository**

   Open your terminal and clone the project repository:

   ```bash
   git clone <repository-url>
   cd health-care-service
   ```

2. **Install Dependencies**

   Install the required dependencies using npm:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the project root directory and add the following variables:

   ```plaintext
   MONGOURI=mongodb://localhost:27017/mydatabase
   PORT=3000
   JWT_SECRET=fhkjgskjvgdsykjfsgdkjhvbhdskjbvds
   JWT_COOKIE_EXPIRES_IN=1d
   DEV_MODE=DEV
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Run the Application**

   Start the application using:

   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000`.

---

## API Endpoints

The following table lists all available API endpoints, their request types, and descriptions:

| Endpoint                     | Request Type | Description                                |
|------------------------------|--------------|--------------------------------------------|
| `/api/auth/login`           | POST         | Authenticate a user and retrieve a token. |
| `/api/auth/register`        | POST         | Register a new user.                       |
| `/api/users`                | GET          | Retrieve all users.                        |
| `/api/users/:id`            | GET          | Retrieve a specific user by ID.           |
| `/api/services`             | POST         | Add a new service.                         |
| `/api/services`             | GET          | Retrieve all services.                     |
| `/api/services/:id`         | PUT          | Update a specific service by ID.          |
| `/api/services/:id`         | DELETE       | Delete a specific service by ID.          |

---

## Contributing

If you would like to contribute to this project, please follow the steps...
