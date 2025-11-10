import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { DataStreamProvider } from '@/components/data-stream-provider';
import RootLayout from '@/components/RootLayout';
import ChatPage from '@/pages/ChatPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <AuthProvider>
        <DataStreamProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RootLayout>
                    <ChatPage />
                  </RootLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <RootLayout>
                    <ChatPage />
                  </RootLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </DataStreamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
