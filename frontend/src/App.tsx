import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer.js";
import LoginOrSignup from "./pages/LoginOrSignup.js";
import { Dashboard } from "./pages/Dashboard.js";
import { Profile } from "./pages/Profile.js";
import { TopRated } from "./pages/TopRated.js";
import { BookReview } from "./pages/BookReview.js";
import { Favorite } from "./components/Favorites.js";
import { Layout } from "./pages/Layout.js";
import { YourInterest } from "./pages/YourInterest.js";
import { Community } from "./pages/Community.js";

function App() {
  return (
    <div className="flex min-w-screen min-h-screen  flex-col items-center bg-white relative">
      <Routes>
        {/* Of course you can add the routes up in here as of now this is just the bare one */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="favorites" element={<Favorite />} />
          <Route path="/topRated" element={<TopRated />} />
          <Route path="/interests" element={<YourInterest />} />
          <Route path="/community" element={<Community />} />
          <Route path="/bookReview/:bookId" element={<BookReview />} />
        </Route>
        {/* <Route path="/restrictedPage" element={<RestrictedPage />} /> */}
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/:loginOrSignup" element={<LoginOrSignup />} />
        <Route path="*" element={<h1>Hello this is the default 404 page</h1>} />
        <Route
          path="/pageNotFound"
          element={<h1>Hello this is the default 404 page</h1>}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
