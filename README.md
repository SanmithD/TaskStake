# TaskStake 📝💰

TaskStake is a MERN stack application that works like a **to-do list with benefits and losses**.  
You can create tasks and earn rewards when completed, or lose funds if you fail or miss them.  
This makes productivity a little more fun (and challenging).

---

## 📂 Project Structure
```bash 

TaskStake/
│
├── client/ # React frontend
│ ├── public/ 
│ └── src/
│ ├── assets/ 
│ ├── components/
│ ├── pages/ 
│ ├── store/ 
│ ├── App.jsx 
│ ├── main.jsx 
│ └── index.css 
│
├── server/ # Express backend
│ ├── src/
│ │ ├── config/ 
│ │ ├── controllers/ 
│ │ ├── middlewares/ 
│ │ ├── models/ 
│ │ ├── routes/ 
│ │ ├── tools/ 
│ │ └── utils/
│ └── uploads/ 
│
├── .env
├── package.json 
├── README.md 

```

## 🚀 Tech Stack

**Frontend**
- React (Vite)
- Zustand (state management)
- React Hot Toast (notifications)
- Tailwind CSS + DaisyUI (UI components & styling)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- Cookie-Parser (session handling)
- Cloudinary (image storage)
- Nodemailer (email service)
- Bcrypt (secure password hashing)

---

## 📌 Features

- ✅ Create, edit, and delete tasks  
- ✅ Upload photos as task proof (stored in Cloudinary)  
- ✅ Auto verify tasks → mark as completed or failed  
- ✅ Fund settlement system  
  - Gain **+5%** on successful tasks  
  - Lose **−10%** on failed tasks  
- ✅ Notifications with React Hot Toast  
- ✅ Authentication with JWT & Bcrypt  
- ✅ Email support using Nodemailer  

---

## 🌍 Live Demo

🔗 [Add later]  

---

## 📎 GitHub Repository

[TaskStake Repo](https://github.com/SanmithD/TaskStake.git)

---

## ⚙️ Setup Instructions

Clone the repository:
```bash
git clone https://github.com/SanmithD/TaskStake.git
cd TaskStake

cd client
npm install
npm run dev

cd server
npm install
npm run dev
```

# 🔑 Environment Variables

Create a .env file in server/ with the following keys:

PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# 👨‍💻 Author

Built with ❤️ by Sanmith Devadiga
---

Do you also want me to include a **sample `.env` file for the client** (like `VITE_API_URL`) or keep all environment variables only on the server side?
