
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isMobile = false,
  onClose 
}) => {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`bg-white border-r border-pink-200 ${isMobile ? 'w-64' : 'w-56'} h-full flex flex-col`}>
      <div className="p-4 border-b border-pink-200">
        <h2 className="text-lg font-semibold text-pink-800">ELSO Admin</h2>
      </div>
      
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-pink-100 text-pink-700 border border-pink-200'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-pink-200">
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
