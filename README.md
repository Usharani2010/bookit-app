# 🌍 BookIt — Travel Experiences Booking Platform

**BookIt** is a full-stack web application that allows users to explore and book travel experiences seamlessly. Built with **React (TypeScript)**, **Node.js**, **Express**, and **MongoDB**, it offers real-time availability, a smooth booking flow, and promo code discounts — all wrapped in a clean, responsive design.

---

## 🌐 Live Demo

- **Frontend**: [https://bookit-app-lime.vercel.app/](https://bookit-app-lime.vercel.app)  
- **Backend API**: [https://bookit-app-64gi.onrender.com/api](https://bookit-app-64gi.onrender.com)

---

## ✨ Key Features

- 🧭 **Browse Experiences** – Explore unique travel experiences across India  
- 🔍 **Search & Filter** – Find experiences by title, category, or location  
- ⏱️ **Real-time Availability** – Dynamic seat tracking and slot validation  
- 💳 **Booking Flow** – End-to-end booking: Home → Details → Checkout → Confirmation  
- 🎟️ **Promo Codes** – Working discount system with minimum-order logic  
- 📱 **Responsive Design** – Works beautifully across all screen sizes  
- ⚙️ **Admin Features** – Add experiences, manage slots, and track bookings  

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- React 18 + TypeScript  
- Vite (fast build tool)  
- TailwindCSS for styling  
- React Router DOM for navigation  
- Axios for API communication  

### ⚙️ Backend
- Node.js + Express.js  
- MongoDB + Mongoose ODM  
- Multer (image uploads)  
- CORS (API access control)  
- JWT authentication (ready for integration)  

### ☁️ Deployment
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas  

---

## 📁 Folder Structure

```
bookit/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page views
│   │   ├── services/       # API handlers
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Main app file
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Upload, auth, etc.
│   ├── server.js           # Express entry point
│   └── package.json
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js ≥ v18  
- MongoDB Atlas account  
- Git installed

---

### 🔧 Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret" > .env

npm run dev
```

### 💻 Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

---

## 📡 API Overview

### 🌴 Experiences
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/experiences` | Fetch all experiences |
| GET | `/api/experiences/:id` | Fetch single experience with slots |
| POST | `/api/experiences` | Add new experience |
| POST | `/api/experiences/:id/slots` | Add slots for experience |

### 📘 Bookings
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/:referenceId` | Fetch booking by reference ID |

### 🎟️ Promo Codes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/promo/validate` | Validate promo code and apply discount |

**Available Promo Codes:**
| Code | Offer | Condition |
|------|--------|------------|
| `SAVE10` | ₹100 off | Orders above ₹500 |
| `WELCOME20` | 20% off | Orders above ₹1000 |
| `FLAT50` | ₹50 off | Orders above ₹300 |

✅ The promo code system is fully implemented and verified.

---

## 🗃️ Database Models

### Experience
```js
{
  title: String,
  description: String,
  shortDescription: String,
  price: Number,
  image: String,
  imageFormat: String,
  location: String,
  duration: String,
  category: String,
  includes: [String],
  rating: Number,
  reviewCount: Number
}
```

### Slot
```js
{
  experienceId: ObjectId,
  date: String,
  time: String,
  maxSeats: Number,
  availableSeats: Number
}
```

### Booking
```js
{
  referenceId: String,
  experienceId: ObjectId,
  slotId: ObjectId,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  seatsBooked: Number,
  totalAmount: Number,
  promoCode: String,
  discount: Number,
  finalAmount: Number,
  status: String
}
```

---

## 🧭 Booking Flow

1. **Homepage:** Browse experiences  
2. **Search:** Filter by title/location  
3. **Details:** Select date/time slot  
4. **Checkout:** Enter details, apply promo code  
5. **Confirmation:** Booking reference displayed  

**Real-time Updates:**
- Seat availability updates instantly after booking  
- Prevents overbooking  
- Dynamic pricing based on discounts  

---

## ⚙️ Environment Variables

### Backend (`.env`)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

### Frontend (`.env`)
```env
VITE_API_URL=https://bookit-app-64gi.onrender.com/api
```

---

## 💡 Deployment Info

### Backend (Render)
- Auto-deploys from GitHub  
- Environment variables managed via Render Dashboard  
- Connects to MongoDB Atlas

### Frontend (Vercel)
- Auto-deploys from GitHub  
- API base URL in `.env`  
- Fast global CDN delivery

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Push and open a pull request  

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👩‍💻 Author

**Usharani** – Developer & Creator  

---
