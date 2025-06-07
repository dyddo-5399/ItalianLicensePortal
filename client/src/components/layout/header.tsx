import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import Navigation from "./navigation";
import { Shield, Globe, Menu, X, User } from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "it" ? "en" : "it");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-[hsl(210,100%,25%)] text-white">
      {/* Top Government Bar */}
      <div className="bg-gray-800 py-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <span>Ministero delle Infrastrutture e dei Trasporti</span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Repubblica Italiana</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleLanguage}
                className="hover:text-gray-300 transition-colors flex items-center space-x-1"
              >
                <Globe className="h-3 w-3" />
                <span>{language.toUpperCase()}</span>
              </button>
              <span className="text-gray-400">|</span>
              <button className="hover:text-gray-300 transition-colors">
                Accessibilità
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[hsl(140,100%,28%)] rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Portale dell'Automobilista</h1>
              <p className="text-sm text-blue-200">Motorizzazione Civile</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Navigation />
            <Button variant="secondary" size="sm" className="bg-white text-[hsl(210,100%,25%)] hover:bg-gray-100">
              <User className="h-4 w-4 mr-2" />
              {t("nav.login")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[hsl(210,100%,40%)] hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Navigation variant="horizontal" />
            <div className="flex items-center space-x-2 py-3">
              <div className="w-6 h-4 bg-[hsl(140,100%,28%)]"></div>
              <div className="w-6 h-4 bg-white"></div>
              <div className="w-6 h-4 bg-[hsl(355,78%,48%)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[hsl(210,100%,40%)] border-t border-blue-500">
          <div className="container mx-auto px-4 py-4">
            <Navigation variant="mobile" />
            <div className="mt-4 pt-4 border-t border-blue-500">
              <Button variant="secondary" size="sm" className="w-full bg-white text-[hsl(210,100%,25%)]">
                <User className="h-4 w-4 mr-2" />
                {t("nav.login")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
