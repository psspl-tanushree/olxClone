import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdDetailPage from './pages/AdDetailPage';
import PostAdPage from './pages/PostAdPage';
import MyAdsPage from './pages/MyAdsPage';
import FavouritesPage from './pages/FavouritesPage';
import SearchPage from './pages/SearchPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-olx-bg flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ads/:id" element={<AdDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/post-ad" element={<PostAdPage />} />
            <Route path="/my-ads" element={<MyAdsPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
