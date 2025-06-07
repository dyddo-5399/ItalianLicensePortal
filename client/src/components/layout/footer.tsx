import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Shield, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  const serviceLinks = [
    { href: "/license-application", label: "Patenti di Guida" },
    { href: "/license-renewal", label: "Carta di Circolazione" },
    { href: "/services", label: "Revisioni" },
    { href: "/appointments", label: "Esami di Guida" }
  ];

  const legalLinks = [
    { href: "#", label: t("footer.privacy") },
    { href: "#", label: t("footer.cookies") },
    { href: "#", label: t("footer.legal") },
    { href: "#", label: t("footer.accessibility") }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Official Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[hsl(210,100%,25%)]" />
                </div>
                <span className="font-bold">Motorizzazione Civile</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{t("footer.ministry")}</p>
              <div className="flex space-x-4">
                <div className="w-6 h-4 bg-[hsl(140,100%,28%)]"></div>
                <div className="w-6 h-4 bg-white"></div>
                <div className="w-6 h-4 bg-[hsl(355,78%,48%)]"></div>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="font-bold mb-4">{t("nav.services")}</h3>
              <ul className="space-y-2 text-sm">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-gray-300 hover:text-white transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold mb-4">Informazioni Legali</h3>
              <ul className="space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-gray-300 hover:text-white transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-4">{t("nav.contact")}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>800-232323</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✉️</span>
                  <span>info@motorizzazione.gov.it</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>Via Giuseppe Caraci, 36 - Roma</span>
                </li>
              </ul>
              
              {/* Social Media */}
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>{t("footer.copyright")}</p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <div className="w-6 h-4 bg-[hsl(140,100%,28%)]"></div>
              <div className="w-6 h-4 bg-white"></div>
              <div className="w-6 h-4 bg-[hsl(355,78%,48%)]"></div>
              <span className="ml-2">Repubblica Italiana</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
