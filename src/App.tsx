/**
 * File: src/App.tsx
 *
 * Description: Root application component that sets up routing
 * and applies the theme provider.
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { HomePage } from './pages/HomePage';

export function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="app-container">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            {/* Add other routes here */}
                        </Routes>
                    </main>
                    {/* Footer would go here */}
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
