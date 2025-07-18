
# Health Care Service Project Documentation



## Overview
The Health Care Service project is a web application that provides health-related services . It includes a Node.js application that interacts with MongoDB and Redis, enabling efficient data storage and caching.

---

## Technologies Used
- **Node.js**: A JavaScript runtime for building scalable server-side applications.
- **MongoDB**: A NoSQL database for storing application data.
- **Redis**: An in-memory data structure store, used as a cache.
- **Docker**: Containerization platform to build, deploy, and manage applications.

---

## Project Structure
```

├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── src
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── index.js
└── .gitignore
```

---
## Setup Instructions

### Prerequisites
- Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) on your machine.

### Cloning the Repository
1. Open your terminal.
2. Clone the repository:
   ```bash
   git clone https://github.com/Puskar-Roy/Health-Care-Service-API
   cd Health-Care-Service-API
   ```

### Running the Application
1. Build and start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. Access the application at `http://localhost:3000`.

### Environment Variables
The following environment variables are set directly in the `docker-compose.yml` file:

```yaml
    environment:
      MONGOURI: mongodb://mongo:27017/mydatabase
      PORT: 3000
      JWT_SECRET: fhkjgskjvgdsykjfsgdkjhvbhdskjbvds
      JWT_COOKIE_EXPIRES_IN: 1d
      DEV_MODE: DEV
      REDIS_HOST: redis
      REDIS_PORT: 6379
```


---

## Setup Instructions Without Docker

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



## Directory Structure Explanation
- `Dockerfile`: Contains instructions to build the Node.js application image.
- `docker-compose.yml`: Defines services, networks, and volumes for the application.
- `src/`: Contains all the source code files for the application.
  - `config/`: Configuration files for connecting to databases and setting up the application.
  - `controllers/`: Handles the request and response logic for the application.
  - `models/`: Defines data models for MongoDB collections.
  - `routes/`: Defines the API endpoints for the application.
  - `services/`: Contains business logic and interacts with models and controllers.
  - `index.js`: Entry point of the application.

## Contribution Guidelines
1. **Fork the repository**: Create your copy of the project.
2. **Create a new branch**: Work on your changes in a separate branch.
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make your changes**: Implement your feature or fix a bug.
4. **Commit your changes**: Write a clear commit message describing your changes.
   ```bash
   git commit -m "Add your message here"
   ```
5. **Push your changes**: Push your branch to your forked repository.
   ```bash
   git push origin feature/YourFeatureName
   ```
6. **Open a pull request**: Submit a pull request to the original repository.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
- **Name**: Puskar Roy

