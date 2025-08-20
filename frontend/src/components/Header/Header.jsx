import { useState } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import UserActions from "./UserActions";
import UserSearch from "./UserSearch";
import MobileMenu from "./MobileMenu";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="font-Jost fixed w-full top-0 z-50 bg-white border-b border-orange-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop navigation */}
          <Navigation />

          <div className="flex items-center">
          {/* User Search */}
          <UserSearch />

          {/* Desktop User Actions */}
          <UserActions />
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;
