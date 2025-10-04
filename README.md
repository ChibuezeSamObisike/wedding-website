# Zubby Music Backend API

A robust Node.js/Express backend API for managing music song suggestions with TypeScript and MongoDB.

## 🚀 Features

- **Song Management**: Create, read, update, and delete song suggestions
- **Status Management**: Track songs with pending, approved, or rejected status
- **Validation**: Comprehensive input validation and error handling
- **Pagination**: Efficient pagination for large datasets
- **Filtering**: Filter songs by status, artist, and other criteria
- **Security**: CORS, Helmet security headers, and input sanitization
- **TypeScript**: Full TypeScript support with strict type checking
- **MongoDB**: Mongoose ODM with optimized indexes

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zubby-music-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string_here
   DATABASE_NAME=zubby_music
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with hot reload using `tsx watch`.

### Production Mode

```bash
npm start
```

This will start the compiled JavaScript version.

## 📚 API Endpoints

### Health Check

- **GET** `/health` - Check if the API is running

### Songs Management

#### Create a Song Suggestion

- **POST** `/api/songs`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "artist": "Artist Name",
    "title": "Song Title",
    "link": "https://example.com/song",
    "message": "Optional message"
  }
  ```

#### Get All Songs

- **GET** `/api/songs`
- **Query Parameters:**
  - `status`: Filter by status (`pending`, `approved`, `rejected`, or `all`)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `artist`: Search by artist name (case-insensitive)
  - `sort`: Sort field (default: `createdAt`)
  - `order`: Sort order (`asc` or `desc`, default: `desc`)

#### Get Song by ID

- **GET** `/api/songs/:id`

#### Update Song Status

- **PUT** `/api/songs/:id/status`
- **Body:**
  ```json
  {
    "status": "approved"
  }
  ```

#### Delete a Song

- **DELETE** `/api/songs/:id`

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint errors automatically

## 🏗️ Project Structure

```
zubby-music-backend/
├── dist/                 # Compiled JavaScript output
├── model/               # Mongoose models
│   └── song.ts         # Song model and interface
├── routes/              # Express route handlers
│   └── song.ts         # Song-related routes
├── index.ts            # Main application entry point
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## 🎯 Song Model Schema

```typescript
interface ISong {
  name: string; // Submitter's name (required)
  artist: string; // Artist name (required)
  title: string; // Song title (required)
  link?: string; // Optional song link (URL)
  message?: string; // Optional message
  status: 'pending' | 'approved' | 'rejected'; // Song status
  createdAt: Date; // Creation timestamp
}
```

## 🔒 Validation Rules

- **Name**: 2-100 characters, required
- **Artist**: 2-100 characters, required
- **Title**: 2-200 characters, required
- **Link**: Valid HTTP/HTTPS URL (optional)
- **Message**: Maximum 500 characters (optional)

## 🚨 Error Handling

The API provides comprehensive error handling with:

- Validation errors with detailed messages
- Duplicate song detection
- Invalid ID format checking
- Database connection error handling
- Global error middleware

## 🔧 Configuration

### Environment Variables

| Variable        | Description               | Default                 |
| --------------- | ------------------------- | ----------------------- |
| `NODE_ENV`      | Environment mode          | `development`           |
| `PORT`          | Server port               | `3000`                  |
| `MONGODB_URI`   | MongoDB connection string | Required                |
| `DATABASE_NAME` | Database name             | `zubby_music`           |
| `CORS_ORIGIN`   | Allowed CORS origin       | `http://localhost:3000` |

## 🧪 Testing the API

### Using curl

1. **Health Check**

   ```bash
   curl http://localhost:3000/health
   ```

2. **Create a Song**

   ```bash
   curl -X POST http://localhost:3000/api/songs \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "artist": "Example Artist",
       "title": "Example Song",
       "message": "Great song!"
     }'
   ```

3. **Get All Songs**
   ```bash
   curl http://localhost:3000/api/songs
   ```

## 🚀 Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy coding! 🎵**
