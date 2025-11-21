# HackForge - Hackathon Management Platform

A full-stack MERN application for managing hackathon events, teams, and participants with real-time features. Build the future through collaborative innovation.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with email verification
- **Role-Based Access Control**: Admin, Organizer, and Participant roles
- **Event Management**: Create, browse, and register for hackathon events
- **Team Management**: Form teams, invite members, and collaborate
- **Real-time Notifications**: Socket.io powered instant updates
- **Messaging System**: Direct and event-specific messaging
- **Profile Management**: Customizable user profiles with avatar upload

### Technical Highlights
- Modern React frontend with Tailwind CSS
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- Real-time communication with Socket.io
- Cloudinary integration for image uploads
- Email service with Nodemailer
- Responsive and mobile-friendly design

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Cloudinary account (for image uploads)
- Email service credentials (Gmail, SendGrid, etc.)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd HackForge
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/hackathon-platform
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:4000/api
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:4000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
hackathon-platform/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware (auth, RBAC)
│   ├── utils/            # Utility functions (email, cloudinary)
│   ├── socket/           # Socket.io handlers
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── lib/          # Utilities (axios config)
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   └── index.html        # HTML template
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `GET /api/users/my-events` - Get user's events
- `GET /api/users/my-teams` - Get user's teams

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Organizer/Admin)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Admin)
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/unregister` - Unregister from event

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/join` - Join team
- `POST /api/teams/:id/leave` - Leave team
- `POST /api/teams/:id/invite` - Invite member

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations list
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/event/:eventId` - Get event messages
- `PUT /api/messages/:id/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🎨 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Socket.io Client
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time features
- Nodemailer for emails
- Cloudinary for image storage
- bcryptjs for password hashing

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Email verification required for sensitive actions
- Role-based access control (RBAC)
- Protected API routes
- CORS configuration
- Input validation

## 🌟 Key Features Explained

### Email Verification
Users must verify their email before creating or joining teams. Verification emails are sent automatically upon signup.

### Role-Based Access
- **Participants**: Can register for events, join teams, send messages
- **Organizers**: Can create and manage events
- **Admins**: Full access to all features including event deletion

### Real-time Features
- Instant notifications for team invites, event updates, and messages
- Live messaging with typing indicators
- Socket.io connection management

### Team Management
- Create teams for specific events
- Invite members via email
- Team leader controls (update, delete, remove members)
- Maximum team size enforcement

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials
- `EMAIL_*` - Email service credentials
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 🐛 Troubleshooting

### Port 5000 Conflict (macOS)
If you encounter port conflicts on macOS (AirPlay Receiver uses port 5000), the backend is configured to use port 4000 instead.

### MongoDB Connection Issues
Ensure MongoDB is running locally or check your Atlas connection string.

### Email Sending Issues
- For Gmail, use an App Password instead of your regular password
- Enable "Less secure app access" or use OAuth2

### CORS Errors
Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@hackathonplatform.com or open an issue in the repository.
# HackForge
