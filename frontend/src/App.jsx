import React from 'react'; // Good practice to include
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // 1. Import MUI theme tools
import CssBaseline from '@mui/material/CssBaseline'; // 2. Import CSS reset

// Import your pages
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Dashboard from './Pages/Dashboard/dashboard';
import Onboarding from './Pages/Onboarding/onboarding';
import ProtectedRoute from './Protection/ProtectedRoute';
import './App.css';

// 3. Define the theme using createTheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    // 4. Wrap the entire application in ThemeProvider
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root path to the login page */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;