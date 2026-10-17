# DevCommunity

DevCommunity is a full-stack platform where developers can join communities, publish technical articles, comment on posts, save articles and manage their developer profiles.

This project was created as the TechTalks Full-Stack Development Capstone Project.

## Features

- GitHub and Google authentication
- Protected routes for authenticated users
- Developer profiles and profile settings
- Create, read, update and delete articles
- Article ownership and authorization
- Communities with join and leave functionality
- Comments with author-only deletion
- Article bookmarks
- Search, filtering and pagination
- Personalized dashboard
- REST API using Next.js Route Handlers
- Server-side validation with Zod
- Loading, empty and error states
- Responsive interface

## Technologies

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Mongoose
- Auth.js
- Zod
- Vercel

## Rendering Strategies

The application uses multiple Next.js rendering strategies:

- **Static Site Generation (SSG):** The home page contains fixed public content and is generated during the production build.
- **Incremental Static Regeneration (ISR):** The communities page is cached and revalidated every 60 seconds to display updated MongoDB data efficiently.
- **Dynamic Rendering:** Authenticated and personalized pages, such as the dashboard, settings and bookmarks, are generated using current session and database data.

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/blogs` | Browse, search and filter articles |
| `/blogs/create` | Create an article |
| `/blogs/[slug]` | View an article and its comments |
| `/blogs/[slug]/edit` | Edit an owned article |
| `/communities` | Browse communities |
| `/communities/[slug]` | Community details and articles |
| `/dashboard` | Personalized developer dashboard |
| `/bookmarks` | Saved articles |
| `/profile` | Current developer profile |
| `/profile/[username]` | Public developer profile |
| `/settings` | Edit profile information |

## REST API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/posts` | Get posts with search and pagination |
| `POST` | `/api/posts` | Create an authenticated user's post |
| `GET` | `/api/posts/[id]` | Get one post |
| `PATCH` | `/api/posts/[id]` | Update an owned post |
| `DELETE` | `/api/posts/[id]` | Delete an owned post |

## Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_auth_secret

AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

Never commit `.env.local` or expose these secret values publicly.

## Getting Started

Install the dependencies:

```bash
npm install
```

Add the required environment variables to `.env.local`, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

Run the following command to verify the production build:

```bash
npm run build
```

## Deployment

The application will be deployed using Vercel.

Live application: Coming soon

## Author

**Ghadir Alameddine**

- GitHub: [Ghadir-alameddine](https://github.com/Ghadir-alameddine)