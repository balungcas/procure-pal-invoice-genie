
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-dashboard-primary">Procurement Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-dashboard-primary flex items-center justify-center text-white">
          <span className="text-sm font-medium">US</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
