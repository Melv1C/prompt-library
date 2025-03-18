/**
 * File: src/App.tsx
 *
 * Description: Root application component that sets up routing
 * and applies the theme provider.
 */

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/common/PublicOnlyRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { CreatePromptPage } from '@/pages/CreatePromptPage';
import { EditPromptPage } from '@/pages/EditPromptPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { MyLibraryPage } from '@/pages/MyLibraryPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PromptDetailPage } from '@/pages/PromptDetailPage';
import { PublicPromptsPage } from '@/pages/PublicPromptsPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <MainLayout>
                    <main>
                        <Routes>
                            {/* Public routes - accessible to all users */}
                            <Route path="/" element={<HomePage />} />
                            <Route
                                path="/prompts"
                                element={<PublicPromptsPage />}
                            />

                            {/* Auth routes - only accessible to non-authenticated users */}
                            <Route
                                path="/login"
                                element={
                                    <PublicOnlyRoute>
                                        <LoginPage />
                                    </PublicOnlyRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <PublicOnlyRoute>
                                        <RegisterPage />
                                    </PublicOnlyRoute>
                                }
                            />
                            <Route
                                path="/forgot-password"
                                element={
                                    <PublicOnlyRoute>
                                        <ForgotPasswordPage />
                                    </PublicOnlyRoute>
                                }
                            />

                            {/* Protected routes - only accessible to authenticated users */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* My Library Page - for viewing user's prompts */}
                            <Route
                                path="/my-library"
                                element={
                                    <ProtectedRoute>
                                        <MyLibraryPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Prompt routes */}
                            <Route
                                path="/prompts/new"
                                element={
                                    <ProtectedRoute>
                                        <CreatePromptPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/prompts/:promptId"
                                element={<PromptDetailPage />}
                            />
                            <Route
                                path="/prompts/:promptId/edit"
                                element={
                                    <ProtectedRoute>
                                        <EditPromptPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Add other routes here */}
                        </Routes>
                    </main>
                </MainLayout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
