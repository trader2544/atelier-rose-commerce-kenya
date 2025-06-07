
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const UserMenu = () => {
  const { user, signOut, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <Link to="/auth">
        <Button className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50 p-2">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white/95 backdrop-blur-sm border-pink-100"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-800">
            {profile?.full_name || user.email}
          </p>
          <p className="text-xs text-gray-600">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center cursor-pointer">
            <ShoppingBag className="h-4 w-4 mr-2" />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut}
          className="flex items-center cursor-pointer text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
