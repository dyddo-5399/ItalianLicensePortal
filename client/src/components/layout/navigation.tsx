import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface NavigationProps {
  variant?: "horizontal" | "mobile";
}

export default function Navigation({ variant = "horizontal" }: NavigationProps) {
  const { t } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/license-application", label: "Patenti" },
    { href: "/appointments", label: t("nav.appointments") },
    { href: "/status-check", label: t("nav.status") },
    { href: "/contact", label: t("nav.contact") }
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  if (variant === "mobile") {
    return (
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "block py-2 px-3 rounded text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-white text-[hsl(210,100%,25%)]"
                  : "text-blue-100 hover:text-white hover:bg-blue-600"
              )}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <div
            className={cn(
              "py-4 px-2 text-sm font-medium transition-colors border-b-2 border-transparent",
              isActive(item.href)
                ? "text-white border-white"
                : "text-blue-200 hover:text-white hover:border-blue-200"
            )}
          >
            {item.label}
          </div>
        </Link>
      ))}
    </nav>
  );
}
