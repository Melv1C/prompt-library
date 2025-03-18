/**
 * File: src/App.tsx
 *
 * Description: Root application component that sets up routing
 * and applies the theme provider.
 */

import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Box className="app-container">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/register"
                                element={<RegisterPage />}
                            />
                            <Route
                                path="/forgot-password"
                                element={<ForgotPasswordPage />}
                            />
                            {/* Add other routes here */}
                        </Routes>
                    </main>
                    {/* Footer would go here */}
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
