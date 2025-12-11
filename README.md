# Prize Draw Platform

A modern, full-stack application for managing and participating in premium prize draws. This platform consists of an Admin Dashboard for campaign management and a Customer-facing application for browsing and entering draws.

## 🚀 Features

### Admin Application
-   **Dashboard Overview**: Real-time statistics on active campaigns, total entries, and specific insights.
-   **Campaign Management**: Create new prize draws with detailed eligibility criteria, start/end dates, and prize types.
-   **Entries Management**: View real-time customer entries for each draw.
-   **Winner Selection**: Secure, transparent winner picking using the **Fisher-Yates Shuffle** algorithm with audit logging.
-   **Audit Logs**: Comprehensive logs of all critical system actions (Draw Creation, Winner Selection).

### Customer Application
-   **Premium Interface**: A "wow" factor UI designed to engage users.
-   **Active Draws**: Browse available competitions.
-   **Status Updates**: Visual indicators for draw status.

## 🛠 Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS (Custom "Premium" Theme).
-   **Backend**: Node.js, Express.
-   **Database**: SQLite (Lightweight, file-based).
-   **Icons**: Lucide React.

## 🏁 Getting Started

### Prerequisites
-   Node.js (v18+)
-   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kampav/prizedrawplatform.git
    cd prizedrawplatform
    ```

2.  **Install Dependencies:**
    You need to install dependencies for the Backend, Admin App, and Customer App separately.

    ```bash
    # Backend
    cd backend
    npm install

    # Admin App
    cd ../admin-app
    npm install

    # Customer App
    cd ../customer-app
    npm install
    ```

### 💾 Database Setup

The project uses SQLite. You can seed the database with initial test data:

```bash
cd backend
node seed.js
```
*This will create `prize_draw_v2.db` and populate it with sample active/completed draws.*

### ⚡ Running the Application

You need to run all three services simultaneously (in separate terminals):

1.  **Backend API** (Runs on `http://localhost:3000`)
    ```bash
    cd backend
    npm run dev
    ```

2.  **Admin App** (Runs on `http://localhost:5173`)
    ```bash
    cd admin-app
    npm run dev
    ```

3.  **Customer App** (Runs on `http://localhost:5174`)
    ```bash
    cd customer-app
    npm run dev
    ```

## 🔒 Security & Auditing

-   **Winner Selection**: The platform uses a crypto-secure implementation of the Fisher-Yates shuffle to ensure fairness.
-   **Audit Trail**: Every critical action (creating a draw, picking a winner) is logged to the database with a timestamp, actor, and detailed snapshot of the event.

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.