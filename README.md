# 🚪 NearShare - A Community-Based Product Sharing Platform

NearShare is a MERN (MongoDB, Express, React, Node.js) stack web application designed to simplify the sharing and discovery of pre-owned items within a local community. Users can post, search, and mark products as sold or expired — all based on location, time, and category filters.

---

## 🔥 Features

### 🧾 User Authentication
- User login & registration with session-based authentication (`express-session`)
- Secure password hashing using `bcrypt`

### 🧍 Product Listings
- Users can **create**, **view**, and **manage** product posts
- Upload images with `multer` and store metadata in MongoDB

### 📍 Location-based Search
- Search for items within a specific **radius and address**
- Address is geocoded using **Geoapify API**
- Haversine formula filters posts by proximity

### ⏳ Post Expiry
- Posts have an **expiry date/time**
- Automatically marked as expired using a **cron job** (`node-cron`)
- Only active, non-expired posts are shown in Home & Search

### 🔍 Advanced Filters
- Search by:
  - Item name
  - Category
  - Condition (new/used/refurbished)
  - Location & Radius

### 🕒 Post Tracking
- In **My Posts**:
  - View status (active, sold, expired)
  - Mark posts as sold
- In **Details**:
  - View how long ago a post was made using `date-fns`

### 🎨 UI/UX & Animations
- Modern UI using custom CSS
- Interactive components built with:
  - `framer-motion`
  - `@react-three/fiber` (DarkVeil, Silk)
  - `reactbits` for animated visuals
- Custom reusable components:
  - `<Button />`, `<Input />`, `<Dropdown />`

---

## 🛠️ Tech Stack

| Frontend        | Backend         | Database  | Other Utilities        |
|-----------------|-----------------|-----------|-------------------------|
| React.js        | Node.js + Express | MongoDB   | Axios, Date-Fns, Node-Cron |
| React Router    | Mongoose        |           | Multer (Image Uploads)  |
| Framer Motion   |                 |           | Geoapify API (Geocoding) |
| ReactBits (UI FX) |               |           |                         |

---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js
- MongoDB
- Git
- Geoapify API Key (get from https://my.geoapify.com)


### 📒 Directory Structure

```bash
NearShare/
├── backend/
│ ├── models/ # Mongoose schemas (User, Post)
│ ├── config/ # MongoDB connection
│ ├── uploads/ # Uploaded images
│ ├── public/ # HTML fallback pages
│ ├── views/ # EJS for history/details
│ ├── app.js # Express app with routes
│ └── .env # Mongo URI, API keys
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable components (Input, Button, etc.)
│ │ ├── pages/ # Pages like Login, Post, Search, etc.
│ │ ├── css files/ # All CSS files
│ │ ├── App.js # Main app structure
│ │ └── index.js
│ ├── public/
│ └── package.json
│
├── README.md
└── .env.example


### 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/Ajay-kanna-356/Nearshare.git
cd nearshare

# Backend Setup
cd backend
npm install
# Add your .env file with:
# MONGODB_URI=your_mongo_uri
# mykey=your_geoapify_key
npm start

# Frontend Setup
cd ../frontend
npm install
npm start


