
# Backend

A REST API built with Node.js, Express, MongoDB, and Redis, featuring real-time communication capabilities with LiveKit integration.

## 🚀 Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: LiveKit
- **Package Manager**: npm/pnpm
- **Development Tools**: Turbo (monorepo management)


## 📁 Project Structure

```
project-root/
├── api/                    # Backend API server
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── public/                # Static files
├── src/                   # Frontend source code
├── node_modules/          # Dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker image configuration
└── README.md            # Project documentation
```


## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **pnpm** (comes with Node.js)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Redis** (v6 or higher) - [Download here](https://redis.io/download)
- **Git** - [Download here](https://git-scm.com/)


### Optional (Recommended)

- **MongoDB Compass** (GUI for MongoDB)
- **Postman** or **Insomnia** (API testing)
- **VS Code** (Code editor)


## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-name>
```


### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (faster)
pnpm install
```


### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
# Database Configuration
MONGOURI=mongodb://localhost:27017/mydatabase

# Server Configuration
PORT=5050
DEV_MODE=DEV

# JWT Configuration
JWT_SECRET=fhkjgskjhvbhdskjbvds
JWT_COOKIE_EXPIRES_IN=1d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# LiveKit Configuration (for real-time features)
LIVEKIT_URL=wss://happycare-n00earcz.livekit.cloud
LIVEKIT_API_KEY=APWijM
LIVEKIT_API_SECRET=LFjJAx7K4F
```


### 4. Start Required Services

#### Start MongoDB

```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb/brew/mongodb-community
```


#### Start Redis

```bash
# On Windows
redis-server

# On macOS/Linux
sudo systemctl start redis
# or
brew services start redis
```


### 5. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Using Turbo (if configured)
npx turbo dev
```

The server will start on `http://localhost:5050`

## 🗂️ Basic API Structure

### Sample Folder Structure for API

```
api/
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   └── index.js
├── models/
│   ├── User.js
│   └── index.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── index.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── utils/
│   ├── database.js
│   ├── redis.js
│   └── jwt.js
└── server.js
```



## 🔧 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```


## 🔐 Authentication Flow

1. **Registration**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` (returns JWT token)
3. **Protected Routes**: Include JWT token in Authorization header
4. **Token Format**: `Bearer <your-jwt-token>`

## 📊 Database Schema Examples

### User Model

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```


## 🐳 Docker Support

### Run with Docker Compose

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down
```


## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
    - Ensure MongoDB is running
    - Check connection string in `.env`
    - Verify database permissions
2. **Redis Connection Error**
    - Ensure Redis server is running
    - Check Redis host and port in `.env`
3. **Port Already in Use**
    - Change PORT value in `.env`
    - Kill process using the port: `lsof -ti:5050 | xargs kill`
4. **JWT Token Issues**
    - Ensure JWT_SECRET is set in `.env`
    - Check token expiration settings

## 📚 Learning Resources

### For Beginners

- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)
- [JWT Introduction](https://jwt.io/introduction)


### API Testing

- Use Postman or Insomnia to test endpoints
- Import the provided collection (if available)

