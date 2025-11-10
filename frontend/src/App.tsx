import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { DataStreamProvider } from "@/components/data-stream-provider";
import ProtectedRoute from "@/components/ProtectedRoute";
import RootLayout from "@/components/RootLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import ChatPage from "@/pages/ChatPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

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
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />
            <Route
              element={
                <ProtectedRoute>
                  <RootLayout>
                    <ChatPage />
                  </RootLayout>
                </ProtectedRoute>
              }
              path="/"
            />
            <Route
              element={
                <ProtectedRoute>
                  <RootLayout>
                    <ChatPage />
                  </RootLayout>
                </ProtectedRoute>
              }
              path="/chat/:id"
            />
          </Routes>
        </DataStreamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
