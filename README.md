# 📒 CreditKhata - Loan Tracker API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-blue)

A secure and scalable RESTful backend API built for shopkeepers and small businesses to manage **credit, loans, and repayments**, using Node.js, Express, and MongoDB.

---

## 🚀 Features

- ✅ JWT-based Authentication
- 👥 Customer Management (CRUD)
- 💰 Loan Issuing and Tracking
- 💳 Repayment Recording
- 🔔 Overdue Notifications (Manual)
- 📄 PDF Receipt Generation
- 📊 Shopkeeper Financial Summary
- 🛡 Security Middleware (Helmet, Rate Limiting, Sanitization)

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT
- **Utilities:** PDFKit, date-fns
- **Security:** Helmet, express-mongo-sanitize, hpp, rate limiting
- **Testing:** Postman

---

## ⚙️ Setup Instructions

### 📦 Prerequisites

- Node.js v18+
- MongoDB (Local or Atlas)
- Git
- npm or yarn

### 📁 Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Pavan-Nagulla/CrediKhaata
   cd CrediKhaata

Install dependencies:
npm install
Environment variables:
Create a .env file in the root with the following content:

PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/creditkhata
JWT_SECRET=your_strong_jwt_secret_key

Replace <username> and <password> with your MongoDB Atlas credentials.
Start the server:
# Development
npm run dev

# Production
npm start
Server will start on: http://localhost:3000
📡 API Documentation

Base URL
http://localhost:3000/api/v1
🔐 Authentication
Endpoint	Method	Description
/auth/register	POST	Register a user
/auth/login	POST	Login, returns token
/auth/logout	POST	Logout the user
🔑 Auth Header Example

All protected routes require a bearer token:

Authorization: Bearer <your-jwt-token>
👥 Customers
Endpoint	Method	Description
/customers	POST	Create new customer
/customers	GET	Get all customers
/customers/:id	GET	Get single customer
/customers/:id	PATCH	Update customer
/customers/:id	DELETE	Delete customer
💰 Loans
Endpoint	Method	Description
/loans	POST	Create a loan
/loans	GET	List all loans
/loans/:id	GET	Loan details
/loans/:id	PATCH	Update loan
/loans/:id	DELETE	Delete loan
💳 Repayments
Endpoint	Method	Description
/repayments	POST	Record a repayment
/loans/:loanId/repayments	GET	Get repayments for a loan
🔔 Notifications
Endpoint	Method	Description
/notifications	GET	List all reminders
/notifications/reminder/:loanId	POST	Send manual reminder (loan)
📊 Summary & Reports
Endpoint	Method	Description
/summary	GET	Get shopkeeper financial stats
/summary/overdue	GET	Get all overdue loans
🧪 Testing with Postman

Steps
Open Postman
Create a new Collection: CreditKhata API
Add requests for each endpoint above
Set base_url: http://localhost:3000/api/v1
Register or login via /auth/login
Copy the JWT token returned
In each protected request, set Headers:
Key: Authorization
Value: Bearer <copied-token>
🔁 Example API Flow (Test Flow in Postman)
Register User
POST /auth/register with name, email, password
Login
POST /auth/login → Save JWT
Create Customer
POST /customers with name, contact details
Create Loan
POST /loans with customerId, amount
Make Repayment
POST /repayments with loanId and amount
Send Reminder
POST /notifications/reminder/:loanId
Get Summary
GET /summary and /summary/overdue
🧾 Sample .env File

PORT=3000
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/creditkhata
JWT_SECRET=792b08ead4e140e2ef35009efafe0753db03d0e73f46fc823f2463a9b68a51d6da306d918067987b29aeb19dbf467845421bea8360dd36fa1b590c266d3ec506
CORS_ORIGIN=http://localhost:3000
📂 Project Structure

creditkhata/
├── config/
│   ├── db.js
│   └── jwt.js
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── loanController.js
│   ├── notificationController.js
│   ├── repaymentController.js
│   └── summaryController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── Customer.js
│   ├── Loan.js
│   ├── Notification.js
│   ├── Repayment.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── customerRoutes.js
│   ├── loanRoutes.js
│   ├── notificationRoutes.js
│   ├── repaymentRoutes.js
│   └── summaryRoutes.js
├── services/
│   ├── notificationService.js
│   ├── pdfService.js
│   └── webhookService.js
├── utils/
│   ├── dateHelpers.js
│   ├── helpers.js
│   └── validators.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md


🛡 Security Middleware

helmet: Sets secure HTTP headers
express-rate-limit: Prevent brute-force
express-mongo-sanitize: Protect against NoSQL injections
hpp: Prevent HTTP parameter pollution
cors: Configurable domain restriction
✅ Development Scripts

npm run dev     # Start with nodemon
npm start       # Production start
