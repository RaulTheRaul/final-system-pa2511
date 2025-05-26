import { AuthProvider } from "./context/AuthContext";
import Router from "./routing/Router";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router />
    </AuthProvider>
  );
}

export default App;