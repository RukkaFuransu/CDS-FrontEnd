Custos de Sistemas (CDS)

📌 About the Project
Custos de Sistemas (CDS) is a modern application built with Vite + React + JavaScript to manage and display Microsoft Office and Zendesk license data. The system fetches data from an API, processes the information, and provides an intuitive interface for cost analysis, advanced filtering, and report export.

🔑 Azure SSO Authentication
✔ Integrated with Microsoft Azure Single Sign-On (SSO) for secure authentication.
✔ Users log in using their Microsoft credentials, ensuring centralized and secure access control.

🚀 Key Features
🔍 License Overview
✔ Displays user-specific license details.
✔ Shows user name, email, department, job title, and office location.

🎯 Advanced Filtering
✔ Filters users by department, job title, office location, or license type.
✔ Allows multiple filters to be applied simultaneously.

💰 Cost Calculation
✔ Automatically calculates the total license cost per user.
✔ Separates Microsoft Office and Zendesk costs for better analysis.

📊 Data Export
✔ Generates Excel (.xlsx) reports with filtered data, including costs and license details.
✔ Supports CSV data export (optional).

📱 Responsive Interface
✔ Modern and adaptive design for different devices.

🛠 Technologies Used
Frontend
🚀 Vite - Ultra-fast build tool.
⚛️ React - JavaScript library for building user interfaces.
🌍 React Router DOM - Routing management for React.
📊 XLSX - Library for generating Excel files.
📄 React CSV - Data export to CSV.
🔧 Dotenv - Environment variable management.

Main Dependencies
├── @eslint/js@9.18.0
├── @types/react-dom@18.3.5
├── @types/react@18.3.18
├── @vitejs/plugin-react@4.3.4
├── dotenv@16.4.7
├── eslint-plugin-react-hooks@5.1.0
├── eslint-plugin-react-refresh@0.4.18
├── eslint-plugin-react@7.37.4
├── eslint@9.18.0
├── globals@15.14.0
├── react-csv@2.2.2
├── react-dom@18.3.1
├── react-router-dom@7.1.3
├── react@18.3.1
├── vite@6.0.11
└── xlsx@0.18.5

🛠 How to Run the Project
🔹 Clone the repository:
git clone https://github.com/your-username/cds.git
cd cds

🔹 Install dependencies:
npm install

🔹 Set up environment variables:
Create a .env file in the project root and add the API URL:
VITE_API_URL=your_api_url

🔹 Start the development server:
npm run dev

🔹 Access the project in your browser:
http://localhost:3333