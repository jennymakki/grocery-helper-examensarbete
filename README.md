# Grocery Helper

A full-stack web application that helps users manage recipes and grocery lists.  
Users can manually create grocery lists or add ingredients directly from recipes.

> **Exam Project – Full-Stack Web Development**

---

## Features

### Authentication
- Google OAuth using **NextAuth**
- Secure, user-specific data
- Automatic redirect to login when unauthenticated

---

### Recipes
- Create new recipes
- Edit recipe title and ingredients
- Delete recipes
- Ingredients stored as arrays for easy reuse

---

### Grocery Lists
- Create grocery lists manually
- Edit grocery list titles
- Delete grocery lists
- Add single grocery items manually
- Remove grocery items
- Check/uncheck items while shopping

---

### Recipe → Grocery List Integration
- Add ingredients from a recipe to:
  - an **existing grocery list**, or
  - a **new grocery list**
- Prevents unnecessary duplicate lists
- Keeps grocery lists flexible and reusable

---

## Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- Client Components
- Fetch API

### Backend
- **Next.js API Routes**
- **MongoDB**
- **Mongoose**

### Authentication
- **NextAuth.js**
- Google Provider
- MongoDB Adapter

---

## Database Models

### Recipe
``` 
{
  title: String,
  ingredients: [String],
  userId: String
}
```

### Grocery List
```
{
  title: String,
  items: [
    {
      name: String,
      checked: Boolean
    }
  ],
  userId: String
}
```
---

### Environment Variables
Create a .env.local file in the root directory:
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_cloudinnary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

---

### Getting Started
Install dependencies:
npm install

Run the development server:
npm run dev

Open your browser at:
http://localhost:3000

---

### User Flow
1. Sign in using Google

2. Create and manage recipes

3. Create grocery lists manually

4. Add ingredients from recipes to a grocery list

5. Add or remove individual grocery items

6. Check items off while shopping

---

## Live demo
https://grocery-helper-examensarbete.vercel.app

