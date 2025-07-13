import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import { AuthContext } from "../../App";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const navigation = [
    { name: "Live View", href: "/", icon: "MonitorSpeaker" },
    { name: "Incidents", href: "/incidents", icon: "AlertTriangle" },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "System", href: "/system", icon: "Settings" }
  ];

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">MetroWatch AI</span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-background"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={16} />
                {item.name}
              </NavLink>
            ))}
          </nav>

{/* System Status & Controls */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-md">
              <StatusIndicator status="online" size="sm" showLabel={false} />
              <span className="text-sm text-text-secondary">All Systems</span>
            </div>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" size={16} />
            </Button>
            
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-md">
                  <ApperIcon name="User" size={16} className="text-accent" />
                  <span className="text-sm text-text-secondary">
                    {user?.firstName || 'User'}
                  </span>
                </div>
                
                <Button variant="ghost" size="sm" onClick={logout}>
                  <ApperIcon name="LogOut" size={16} />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-border"
          >
            <nav className="py-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:text-text-primary hover:bg-background"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;