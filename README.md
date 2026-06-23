# Anonymous Messaging Web App (NGL Clone)

A modern, mobile-first anonymous messaging application where users can send anonymous messages, which are securely stored in a Neon Postgres DB, and viewed/managed via a private Admin Dashboard.

## 🚀 Features

- **Anonymous Message Sending (`/`)**: Centered beautiful white card layout with gradient backgrounds, name field (with note that it won't be displayed publicly), message input field, and a sleek pink/red submit button.
- **Admin Dashboard (`/admin`)**: Protected dashboard showing all received messages in reverse chronological order, with a secure password-based login and delete functionality.
- **FastAPI Backend**: Fully asynchronous Python REST API using SQLModel ORM to manage Postgres tables and secure resources.
- **Neon Postgres Integration**: Uses serverless Neon Postgres DB securely with connection-pooling.

---

## 🛠️ Project Structure

```bash
ngl/
├── backend/                  # FastAPI Backend code
│   ├── main.py               # Main application and REST endpoints
│   ├── models.py             # SQLModel DB Schema Definition
│   ├── database.py           # Database connection setup
│   ├── requirements.txt      # Backend Python dependencies
│   └── .env                  # Backend credentials/secrets
└── frontend/                 # Next.js Frontend code
    ├── app/
    │   ├── page.tsx          # Public NGL message form
    │   ├── admin/
    │   │   └── page.tsx      # Admin dashboard login and list view
    │   ├── globals.css       # Layout styles and gradient definitions
    │   └── layout.tsx        # Base metadata and wrapper
    └── .env.local            # Frontend API Config
```

---

## 💻 Local Setup & Execution Instructions

Follow these simple steps to run both the frontend and backend locally.

### 1. Backend Setup (FastAPI)

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create a Python Virtual Environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**:
   - **Windows PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows CMD**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure Environment Variables**:
   Create a `.env` file inside the `backend` folder (already prepared for you with your configured variables):
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_VkAhIj86pndX@ep-floral-credit-ad14qlju-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ADMIN_SECRET=Rafay@2005
   ```

6. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The server will start on `http://localhost:8000`. It will automatically create the `messages` table in your Neon database upon first startup.*

---

### 2. Frontend Setup (Next.js)

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install node packages**:
   ```bash
   npm install
   ```

3. **Configure Frontend Environment Variable**:
   Create a `.env.local` inside the `frontend` directory (already configured with a fallback to local backend port):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the Next.js Development Server**:
   ```bash
   npm run dev
   ```
   *The client application will run on `http://localhost:3000`.*

---

## 🎨 UI/UX Features Built-in

- **Beautiful NGL Gradient**: Pink to red premium background matching standard NGL styling.
- **Card Design**: Rounded, shadowed, centered desktop card container which responds perfectly on mobile devices.
- **Validation**: Full form validation and responsive UX showing sending states and successful submission confirmation screens.
- **Dynamic Messages**: Delete triggers alert confirmations and dynamically sweeps from frontend state on success.
