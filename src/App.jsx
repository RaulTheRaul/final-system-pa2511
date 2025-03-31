import { AuthProvider } from "./context/AuthContext";
import Router from "./routing/Router";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;