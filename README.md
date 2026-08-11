# DevLink

DevLink is a full-stack platform built to address a common challenge: finding other developers to collaborate with. When learning to code or starting a new side project, finding partners who have complementary skills, aligned interests, and similar goals is often difficult. Traditional networking channels are either too formal or lack developer-focused profiles. DevLink provides a casual, interactive space where developers can showcase their skills, browse profiles, and connect for project collaboration.

The platform uses a card-based interface with gesture support, allowing users to browse other developer profiles. Users can swipe right (or click "Interested") to send a request, or swipe left (or click "Ignore") to pass. When two developers express mutual interest, they become connected and can start chatting in real time.

## Core Features

* **Gesture-Based Profile Browsing**: Interactive card interface allowing users to swipe or click to connect with or ignore profiles.
* **Developer Profiles**: Cards showing key developer attributes including first name, last name, age, gender, skills, and about bio.
* **Request Management**: Dedicated screen to review and accept incoming requests.
* **Mutual Connections**: A listing of all connected developers to facilitate collaboration.
* **One-to-One Real-Time Chat**: Secure messaging between connected developers powered by Socket.IO with automatic message history persistence in MongoDB.
* **Conversation Directory**: A dedicated `/chat` page listing all developers you have previously started conversations with for quick access.
* **Profile Customization**: Options to edit profile details (age, bio, skills, profile picture link).
* **Secure Authentication**: Cookie-based user sessions using JWTs (JSON Web Tokens) with secure HTTP-only cookies and passwords encrypted via Bcrypt.

## Tech Stack

* **Frontend**: React, React Router DOM, Redux Toolkit, Tailwind CSS (v4), DaisyUI (v5), Framer Motion, Axios, Socket.IO Client.
* **Backend**: Node.js, Express.js, Socket.IO.
* **Database**: MongoDB (via Mongoose ODM).
* **Security & Input Validation**: JSON Web Tokens (JWT), Bcrypt, Validator.js.

## Architecture & Folder Structure

```text
d:/DevLink/
├── DevLink BackEnd/   # Express.js API, Socket.IO utility, schemas, and routers
└── DevLink FrontEnd/  # React application with Tailwind styling and Redux state
```

### Communication Flow
* **REST APIs**: Used for resource-heavy operations (authentication, profile edits, connection requests, and historical chat downloads).
* **WebSockets**: Established via Socket.IO client-server handshakes. Used for routing and broadcasting message events in real time. Senders are verified using secure socket user instances (`socket.user._id`), avoiding payload sender spoofing.

### Authentication & Chat Authorization
1. **JWT Verification**: Upon signing in, a JWT cookie is created. Both REST API calls (via `UserAuth` middleware) and Socket.IO handshakes (via middleware parsing incoming cookies) verify the token signature to establish user identity.
2. **Connection Enforcement**: Chat API endpoints (`GET /chat/:targetUserId`) and real-time socket events (`sendMessage`) run database query validation checking:
   ```javascript
   const areConnected = await ConnectionRequest.areConnected(userId, targetUserId);
   ```
   If no accepted connection request exists in MongoDB between the pair, message transmission and history fetches are blocked.
3. **Deterministic Rooms**: Socket communication is organized into separate, private rooms. The room ID is generated deterministically by sorting the two participant IDs alphabetically (e.g. `[userId, targetUserId].sort().join("_")`), aligning clients to the exact same room automatically.

## API Overview

### Authentication
* `POST /signup` - Register a new account.
* `POST /login` - Sign in and establish cookie session.
* `POST /logout` - Terminate session and clear cookie.

### Profile Management
* `GET /profile/view` - Fetch current user profile.
* `PATCH /profile/edit` - Update profile details.
* `PATCH /profile/updatePassword` - Change password.

### Connection Actions
* `POST /request/send/:status/:userId` - Send request (`interested` or `ignored`) to a user.
* `POST /request/review/:status/:requestId` - Review request (`accepted` or `rejected`).
* `GET /user/requests/received` - View incoming connection requests.
* `GET /user/connections` - List mutual connections.
* `GET /feed` - Fetch profiles for discovery feed.

### Chat & Messaging
* `GET /chat` - List developers the user has active chat histories with (populated profile fields only).
* `GET /chat/:targetUserId` - Verify connection and fetch message history for an individual chat.

## Running Locally

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd "DevLink BackEnd"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root:
   ```env
   PORT=7777
   DB_CONNECTION_STRING=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Seed the database with diverse mock profiles (idempotent, safe seed):
   ```bash
   npm run seed
   ```
   *Note: If you need to perform a destructive reset during development, run `npm run seed:reset`. This wipes database collections and re-seeds clean test profiles.*
5. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd "DevLink FrontEnd"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

## Future Improvements

* **Filter by Skills**: Allow filtering the developer feed by specific technologies or tags.
* **Pagination**: Implement scroll pagination on connections, requests, and discovery pages.
* **Notification Indicators**: Add visual indicators for unread message events.

## Challenges Faced & Lessons Learned

* **CORS Configuration**: Managing session cookies between frontend and backend ports required strict setup of headers and origins. Resolved by making origins environment-aware for both Express and Socket.IO.
* **Safe Seeding**: Implemented idempotent database seeding using email lookups. This ensures developer data can be added additively without wiping out production databases or breaking MongoDB primary-key dependencies.
* **Mongoose Casting inside `$or` queries**: Discovered that casting string IDs to ObjectIds inside `$or` queries can sometimes fail due to query cache behaviors. Resolved by introducing explicit Mongoose casting (`new mongoose.Types.ObjectId(id)`) inside static model queries.

## License

This project is licensed under the MIT License.
