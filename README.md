# Ronin Log Admin
The admin dashboard for [Ronin Log](https://github.com/Olly-Codes/ronin-log-api). Built with React and Tailwind CSS, this is a tool used to enable admins to write and manage reviews, moderate comments, and oversee users. 

This is specifically an admin-only front-end. It's not public facing but the public facing site, which is a separate project, is in progress and it should allow for browsing and commenting on published reviews.

This front end talks to [ronin-log-api](https://github.com/Olly-Codes/ronin-log-api), the REST API is backing the platform.

## Overview
Admins can write reviews and add a title, score, cover image, genres, media type and demographic. The written review is automatically saved as a draft and can be published whenever ready. Each form has a live preview that mirrors the actual review page layout, so an admin can be certain that everything is formatted properly and eventually will be what the public facing site shows

## Home
<img width="1920" height="962" alt="ronin-log-admin-dashboard" src="https://github.com/user-attachments/assets/a9413aa5-1923-482a-9f97-5686b864b01e" />

## Review Edit
<img width="1920" height="1335" alt="ronin-log-admin-review-edit" src="https://github.com/user-attachments/assets/837af6c4-31de-4fd7-ad28-0c5970e93da8" />

## Features
- Ability to write reviews with: title, markdown body, score, genres, media type, demographic and cover image upload (via Cloudinary)
- Live preview while writing or editing a review
- Ability to publish / unpublish reviews
- Comment moderation
- JWT authenticated admin-only access, backed by [ronin-log-api](https://github.com/Olly-Codes/ronin-log-api)'s role-based auth
- Dark theme, inspired by MAL and Anilist

  ## Tech Stack
  - React
  - Tailwind CSS
  - Axios
  - Vercel
  - Render
  - Supabase
  - Cloudinary (image uploads)

## Getting Started
### Prerequisites
  - Node.js
  - A running instance of [ronin-log-api](https://github.com/Olly-Codes/ronin-log-api) (local or deployed)
  - A cloudinary account (for image uploads)

### Installation
1. Clone this repo
```bash
git clone https://github.com/Olly-Codes/ronin-log-api
```

### Installation
1. Clone this repo
```bash
git clone https://github.com/Olly-Codes/ronin-log-admin.git
cd ronin-log-admin
```

2. Install dependencies
```bash
npm install
```

3. Create a separate `.env` file in the root directory. The variables should be listed in the `.env example` in this repo
   
4. Seed the database
- You can optionally seed the database with `npm run db` you will just have to remove the users insert query as the auth won't work unless users are created via the endpoints (password encryption)

5. Start the development server
```bash
npm run dev
```

## Deployment
This project is deployed on Vercel, with the API hosted separately on Render and the database on Supabase.

## What I learned
- Configuring and using tailwind css
- Handling image uploads to a third-party service (Cloudinary)
- Creating forms with a live preview (markdown)
- Deployment specific bugs like case-sensitivity issues and CORS

