
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  KanbanSquare,
  MessageSquare,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  subItems?: { label: string; href: string }[];
}

const NavItem = ({ icon: Icon, label, href, active = false, subItems }: NavItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleClick = () => {
    if (subItems && subItems.length > 0) {
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      <Link 
        to={href}
        onClick={subItems && subItems.length ? handleClick : undefined}
        className={cn(
          "flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "hover:bg-primary/10 text-sidebar-foreground"
        )}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="flex-grow">{label}</span>
        {subItems && subItems.length > 0 && (
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "transform rotate-180")} />
        )}
      </Link>
      
      {subItems && expanded && (
        <div className="ml-9 mt-1 space-y-1">
          {subItems.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="flex items-center py-2 px-4 rounded-md text-sm text-sidebar-foreground hover:bg-primary/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0", 
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                HR
              </div>
              <span className="ml-3 text-xl font-semibold">HireFlow</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)} 
              className="md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/dashboard"
              active={location.pathname === "/dashboard"}
            />
            <NavItem
              icon={Briefcase}
              label="Jobs"
              href="/jobs"
              active={location.pathname === "/jobs"}
            />
            <NavItem
              icon={Users}
              label="Candidates"
              href="/candidates"
              active={location.pathname === "/candidates"}
            />
            <NavItem
              icon={KanbanSquare}
              label="Workflow"
              href="/workflow"
              active={location.pathname === "/workflow"}
            />
            <NavItem
              icon={MessageSquare}
              label="Messages"
              href="/messages"
              active={location.pathname === "/messages"}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              href="/settings"
              active={location.pathname.startsWith("/settings")}
              subItems={[
                { label: "Profile", href: "/settings/profile" },
                { label: "Notifications", href: "/settings/notifications" },
                { label: "Company", href: "/settings/company" },
              ]}
            />
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Help Center
              </a>
            </Button>
            <div className="mt-4 px-4 py-2 bg-gray-100 rounded-md">
              <p className="text-sm font-medium">HireFlow Nexus</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay for mobile when sidebar is open */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
