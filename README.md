# E-Pustaka: Modern Library Management Dashboard

A modern, premium, and responsive Library Management Dashboard built with a **Neo-Brutalist Monochrome** design system, featuring **Muted Pastel** accents. The application connects dynamically to a Golang Fiber REST API backend or can run entirely in a local-only Mock Database mode.

---

## 🚀 Tech Stack
- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Pure CSS (Custom Neo-Brutalist Monochrome Variables & Layouts)
- **Icons**: Lucide React
- **Backend**: Go (Fiber framework)
- **Database**: MySQL

---

## 🛠️ How to Run the Project

### 1. Run the Frontend (React App)
Navigate to the root project folder:
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open the web app in your browser at `http://localhost:3000`.

### 2. Run the Backend (Golang API Server - Optional)
Ensure you have Go and MySQL installed, then navigate to the backend folder:
```bash
cd api-backend

# Configure your database connection in .env (copy from .env.example)
# DB_Host=127.0.0.1
# DB_Port=3306
# DB_Username=root
# DB_Password=
# DB_Name=golang_perpustakaan

# Run the migrations (if databases are not initialized yet)
# go run create_db.go

# Start the Fiber server
go run main.go
```
The backend server runs on `http://localhost:8001/api/v1`.

---

## 🔑 Login Credentials (Demo & Testing)
Use the following seeder credentials to log into the Librarian Area:
- **Username**: `admin`
- **Password**: `admin`

---

## 💡 Key Features
1. **Dual-Mode API Gateway**: Dynamically switch backend connection states under the hood. It utilizes `sessionStorage` in Mock mode for 100% complete instant CRUD operations with zero database setup.
2. **Neo-Brutalist Visual Aesthetic**: Strictly monochrome layouts (Obsidian Dark / Crisp White Light modes), thick high-contrast borders, sharp elements (`6px` border-radius), and muted pastel metrics banners.
3. **Editorial Typography**: Heading layouts styled with bold fonts and tight letter-spacing for premium editorial aesthetic.
4. **Resilient Data Interceptors**: Built-in Axios wrappers to safely map empty backend lists (`null` fields) to safe empty variables to ensure zero runtime blank screen crashes.
