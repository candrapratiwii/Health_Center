# Health Center - Puskesmas Management System

A modern web application for managing health center (Puskesmas) operations built with React, Vite, and Ant Design.

## Features

- **User Authentication**: Secure login system with JWT tokens
- **Role-based Access**: Different interfaces for Admin and Staff
- **Dashboard**: Real-time statistics and charts
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Ant Design components

## Tech Stack

- **Frontend**: React 19, Vite, Ant Design
- **Styling**: Tailwind CSS, Styled Components
- **Charts**: React ApexCharts
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Storage**: Encrypt Storage for secure token storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with:

   ```
   VITE_REACT_APP_API_URL=https://your-backend-url.ngrok-free.app
   VITE_REACT_APP_SECRET_KEY_STORE=your-secret-key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── providers/          # Context providers
├── utils/              # Utility functions
├── assets/             # Static assets
└── main.jsx           # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
