import { AuthProvider } from "@/src/context/AuthContext";
import InterQCoachWidget from "../components/InterQCoachWidget";

export const metadata = {
  title: "IntervueAI | AI Mock Interview Platform",
  description: "AI Powered Interview Practice Platfrom",
  icons: {
      icon: "./favicon.ico",
  },
};


export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
          <InterQCoachWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
