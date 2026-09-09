# Story Sphere

A polished social-story web app with a responsive dashboard, separate Stories feed, profiles, followers/following, notifications, settings/themes and real-time messaging.

## Highlights
- Animated Story Sphere splash screen with the supplied logo, then automatic auth routing.
- Responsive desktop/tablet/mobile UI with mobile bottom navigation.
- Dedicated `/posts` Stories feed and `/create-post` publishing flow.
- Premium Sign in / Sign up screens using the supplied Story Sphere branding.
- Profile pages with follower/following lists, follow/unfollow and direct messaging.
- Real-time messaging through Server-Sent Events (SSE), with normal REST persistence.
- Settings with 7 themes: Light, Dark, Green, Purple, Neon Green, Neon Red and Sphere Glow.
- Experience, notification, sound, privacy-preview and reduced-motion preferences persisted locally.
- Loading states use the supplied Story Sphere icon.

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` if the backend is not running at `http://localhost:5000/api`.

## Main routes
- `/` splash
- `/login`, `/register`
- `/home` dashboard
- `/posts` Stories
- `/create-post`
- `/messages`
- `/notifications`
- `/search`
- `/profile/:userId`
- `/settings`
