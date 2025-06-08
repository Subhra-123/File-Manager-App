# File Manager Application

A full-stack file management application built with Spring Boot (backend) and Next.js (frontend) that allows users to upload, view, download, and manage files.



## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17 or higher**
- **Maven 3.6+**
- **Node.js 20+**
- **npm or yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd file-manager-app
```

### 2. Backend Setup

#### Navigate to backend directory:
```bash
cd backend
```

#### Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`



### 3. Frontend Setup

#### Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔧 Configuration



## 🚦 Running the Application

1. **Start the backend** (Terminal 1):
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start the frontend** (Terminal 2):
   ```bash
   cd frontend
   npm install  # Only needed first time
   npm run dev
   ```

3. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api/files`
   - H2 Console: `http://localhost:8080/h2-console`