import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}