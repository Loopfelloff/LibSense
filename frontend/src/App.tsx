import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LoginOrSignup from "./pages/LoginOrSignup";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <div className="flex min-w-screen min-h-screen  flex-col items-center bg-white relative">
      <Routes>
        {/* Of course you can add the routes up in here as of now this is just the bare one */}
        <Route path="/home" element={<Dashboard />} />
        <Route
          path="/pageNotFound"
          element={<h1>Hello this is the default 404 page</h1>}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:loginOrSignup" element={<LoginOrSignup />} />
        <Route path="*" element={<h1>Hello this is the default 404 page</h1>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
