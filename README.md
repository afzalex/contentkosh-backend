# Contentkosh Backend

A Node.js/TypeScript backend API for the Contentkosh application with Prisma ORM and PostgreSQL.

## Features

- **User Management**: Registration, login, and profile management with Prisma ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with Prisma ORM and migrations
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Winston-based logging system
- **TypeScript**: Full TypeScript support with strict type checking
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Logging**: Winston
- **API Documentation**: Swagger/OpenAPI
- **Development**: Nodemon, ts-node

## Project Structure

```
src/
├── config/
│   ├── config.ts            # Application configuration
│   ├── database.ts          # Prisma client configuration
│   └── swagger.ts           # Swagger documentation configuration
├── controllers/
│   └── userController.ts    # User-related operations
├── middlewares/
│   ├── auth.middleware.ts   # Authentication middleware
│   └── errorHandler.ts      # Error handling middleware
├── models/
│   └── User.ts             # User model with Prisma operations
├── services/
│   └── authService.ts      # Authentication service (JWT, password hashing)
├── repositories/
│   └── user.repo.ts        # User repository for database operations
├── dtos/
│   └── auth.dto.ts         # Data transfer objects
├── routes/
│   ├── index.ts            # Main routes
│   └── userRoutes.ts       # User routes with Swagger docs
├── utils/
│   ├── apiResponse.ts      # API response handler
│   └── logger.ts           # Logging utility
├── contexts/
│   └── request-context.ts  # Request context management
└── index.ts                # Application entry point

prisma/
└── schema.prisma           # Database schema and Prisma configuration
```

## Architecture

The application follows a clean architecture pattern with proper separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic (authentication, validation, etc.)
- **Repositories**: Handle database operations only
- **Middlewares**: Handle cross-cutting concerns (auth, error handling)
- **Config**: Centralized configuration management
- **DTOs**: Data transfer objects for type safety

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL:
   - Install PostgreSQL on your system
   - Create a database named `contentkosh`

4. Configure environment variables:
   - Copy `.env.example` to `.env` (if it doesn't exist)
   - Update the `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/contentkosh?schema=public"
   ```

5. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or use migrations (for production)
npm run db:migrate
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:8080`

## API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:8080/api-docs
```

The Swagger UI provides:
- **Interactive API testing** - Test endpoints directly from the browser
- **Request/Response schemas** - View expected data structures
- **Authentication** - Test protected endpoints with JWT tokens
- **Error responses** - See all possible error scenarios

### API Endpoints

#### Health Check
- `GET /health` - Check API health

#### User Management
- `POST /api/users/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- `POST /api/users/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `GET /api/users/profile` - Get user profile (requires Authorization header)

## Database Schema

### Users Table (Prisma Schema)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and apply migrations
- `npm test` - Run tests (not implemented yet)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8080 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT secret key | your-secret-key |
| `JWT_EXPIRES_IN` | JWT expiration | 24h |

## Testing the API

### Using Swagger UI (Recommended)
1. Start the server: `npm run dev`
2. Open `http://localhost:8080/api-docs`
3. Use the interactive interface to test endpoints

### Using cURL

#### Register a new user:
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

#### Login:
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Get profile (with token):
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Management

### Using Prisma Studio
```bash
npm run db:studio
```
This opens a web interface to view and edit your database.

### Creating Migrations
```bash
npm run db:migrate
```
This creates a new migration file and applies it to the database.

### Pushing Schema Changes (Development)
```bash
npm run db:push
```
This pushes schema changes directly to the database without creating migration files.

## TODO

- [x] Implement database connection (PostgreSQL + Prisma)
- [x] Add JWT authentication
- [x] Add password hashing with bcrypt
- [x] Implement user registration and login
- [x] Separate concerns (models, services, controllers)
- [x] Add API documentation (Swagger)
- [ ] Add input validation middleware
- [ ] Add user roles and permissions
- [ ] Implement content management
- [ ] Add file upload functionality
- [ ] Add pagination for listings
- [ ] Add search functionality
- [ ] Add tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 