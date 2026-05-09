# ReCart – Student Marketplace

A student-focused second-hand marketplace built with the MERN stack.

## Tech Stack

- **MongoDB** – Database
- **Express.js** – Backend framework
- **React.js** (Vite) – Frontend
- **Node.js** – Runtime
- **Socket.io** – Real-time chat
- **Cloudinary** – Image storage
- **JWT** – Authentication

## Features

- User Authentication (JWT login/signup)
- Product Listings (CRUD with image upload to Cloudinary)
- Smart Search & Filters (keyword, category, condition, price range)
- Real-time Chat (Socket.io with typing indicators & emoji support)
- Wishlist / Favorites
- Dashboard (My Listings, Chats, Wishlist, Profile)
- Trust Score System
- Campus-Only Mode
- Exchange Support

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd recart
```

### 2. Install Dependencies

```bash
# Root dependencies (concurrently)
npm install

# Server dependencies
cd server && npm install && cd ..

# Client dependencies
cd client && npm install && cd ..
```

### 3. Configure Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/recart
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Application

```bash
npm run dev
```

This starts both the server (port 5000) and client (port 5173) concurrently.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get current user profile (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products (supports search/filter query params) |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create a product (protected, multipart) |
| DELETE | /api/products/:id | Delete a product (protected) |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/messages/conversations | Get all conversations (protected) |
| GET | /api/messages/:receiverId/:productId | Get chat history (protected) |
| POST | /api/messages | Send a message (protected) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/:id | Get user profile |
| PUT | /api/users/profile | Update profile (protected) |
| GET | /api/users/wishlist | Get wishlist (protected) |
| PUT | /api/users/wishlist/:productId | Toggle wishlist item (protected) |
| GET | /api/users/my-listings | Get user's listings (protected) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Create a review (protected) |
| GET | /api/reviews/:userId | Get reviews for a user |

## Project Structure

```
Root/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, ProductCard
│   │   ├── pages/          # Home, Login, Register, Dashboard, Chat, etc.
│   │   ├── context/        # AuthContext, SocketContext
│   │   ├── services/       # API helper functions
│   │   └── App.jsx
│   └── package.json
├── server/                 # Express Backend
│   ├── config/             # DB, Cloudinary config
│   ├── controllers/        # Auth, Product, Message, Review, User
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/          # Auth, Upload middleware
│   └── server.js
├── shared/                 # Shared constants
├── package.json            # Root (concurrently)
└── README.md
```
