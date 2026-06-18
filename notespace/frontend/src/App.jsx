import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import ViewNotePage from './pages/ViewNotePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotesProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e1e1e',
                color: '#fff',
                border: '1px solid #2e2e2e',
                fontSize: '13px',
              },
              success: {
                iconTheme: { primary: '#8b5cf6', secondary: '#fff' },
              },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/note/new"
              element={
                <ProtectedRoute>
                  <CreateNotePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/note/:id"
              element={
                <ProtectedRoute>
                  <ViewNotePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/note/:id/edit"
              element={
                <ProtectedRoute>
                  <EditNotePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
