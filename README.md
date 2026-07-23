# DevLink

DevLink is a full-stack platform built to address a common challenge: finding other developers to collaborate with. When learning to code or starting a new side project, finding partners who have complementary skills, aligned interests, and similar goals is often difficult. Traditional networking channels are either too formal or lack developer-focused profiles. DevLink provides a casual, interactive space where developers can showcase their skills, browse profiles, and connect for project collaboration.

The platform uses a card-based interface with gesture support, allowing users to browse other developer profiles. Users can swipe right (or click "Interested") to send a request, or swipe left (or click "Ignore") to pass. When two developers express mutual interest, they become connected.

## Screenshots

*Screenshots will be added once the project is deployed to a staging environment.*

* **Login Page**: `[Insert Screenshot of Login Page here]`
* **Main Feed / Gesture Browsing**: `[Insert Screenshot of Feed here]`
* **Connections List**: `[Insert Screenshot of Connections here]`
* **Profile Edit Screen**: `[Insert Screenshot of Profile Edit here]`

## Core Features

* **Gesture-Based Profile Browsing**: Interactive card interface allowing users to swipe or click to connect with or ignore profiles.
* **Developer Profiles**: Cards showing key developer attributes including first name, last name, age, gender, skills, and about bio.
* **Request Management**: Dedicated screen to accept or reject incoming requests.
* **Mutual Connections**: A listing of all mutual connections to facilitate collaboration.
* **Profile Customization**: Options to edit profile details (age, bio, skills, profile picture link).
* **Secure Authentication**: Cookie-based user sessions with password hashing.

## Tech Stack

* **Frontend**: React, React Router DOM, Redux Toolkit, Tailwind CSS (v4), DaisyUI (v5), Framer Motion, Axios.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (via Mongoose ODM).
* **Security & Input Validation**: JSON Web Tokens (JWT), Bcrypt, Validator.js.

## Architecture & Folder Structure

```text
d:/DevLink/
├── DevLink BackEnd/   # Express.js API, schemas, and routers
└── DevLink FrontEnd/  # React application with Tailwind styling and Redux state
```

## Authentication Flow

1. **Input Validation**: Signups require a valid email format, minimum password strength, and correct name lengths.
2. **Password Hashing**: Passwords are securely hashed with 10 salt rounds before storage.
3. **Session Cookies**: Upon login, a signed JSON Web Token (JWT) is returned to the browser in an `httpOnly` cookie.
4. **Endpoint Access**: Private routes (feed, requests, profile edits) use middleware to verify the JWT cookie and fetch the user profile.

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
3. Create a `.env` file in backend root:
   ```env
   PORT=7777
   DB_CONNECTION_STRING=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start development server:
   ```bash
   npm start
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
* **Direct Messaging**: Integrate web sockets to allow matched developers to message each other in-app.
* **Pagination**: Implement scroll pagination on connections and discovery pages.

## Challenges Faced & Lessons Learned

* **CORS Configuration**: Managing session cookies between frontend and backend ports required strict setup of headers and origins.
* **Feed Filters**: Building database queries to exclude matching, ignored, and self profiles was complex but taught me detailed aggregation and lookup logic in Mongoose.
* **Gesture States**: Coordinating visual swipe animations with actual React component state and async REST calls.

## License

This project is licensed under the MIT License.
