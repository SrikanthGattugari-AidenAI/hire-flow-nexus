
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div 
      className={cn(
        "min-h-screen w-full bg-gradient-to-br from-primary-50 via-white to-blue-50 flex flex-col items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-md mx-auto mb-8 flex flex-col items-center justify-center">
        <Link to="/" className="flex items-center justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          </div>
          <span className="ml-2 text-2xl font-bold text-gray-800">TalentFlow</span>
        </Link>
      </div>
      
      {children}

      <div className="mt-8 text-sm text-center text-muted-foreground">
        &copy; {new Date().getFullYear()} TalentFlow. All rights reserved.
      </div>
    </div>
  );
}
