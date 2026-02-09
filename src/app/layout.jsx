import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <SmoothScroll>
            <Navbar />
            {children}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}