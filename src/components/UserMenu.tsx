
import React, { useState } from 'react';
import { User, Settings, ShoppingBag, MessageSquare, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
  };

  if (!user) {
    return (
      <>
        <Button
          onClick={() => setShowAuthModal(true)}
          className="btn-primary"
        >
          Sign In
        </Button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-800 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-blue-800" />
        </div>
        <span className="hidden md:block font-medium">
          {profile?.full_name || user.email}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 luxury-card py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="font-medium text-gray-800">
              {profile?.full_name || user.email}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Admin
              </span>
            )}
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>My Orders</span>
            </Link>

            <Link
              to="/messages"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
