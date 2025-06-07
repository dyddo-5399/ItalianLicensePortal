import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ui/service-card";
import StatusCheckForm from "@/components/forms/status-check-form";
import { useLanguage } from "@/hooks/use-language";
import { FileText, RotateCcw, Search, Calendar, Phone, MapPin } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const mainServices = [
    {
      icon: FileText,
      title: t("service.newLicense.title"),
      description: t("service.newLicense.description"),
      href: "/license-application",
      className: "gov-blue",
      estimatedTime: "15 minuti",
      cost: "€73.50"
    },
    {
      icon: RotateCcw,
      title: t("service.renewLicense.title"),
      description: t("service.renewLicense.description"),
      href: "/license-renewal",
      className: "italian-green",
      estimatedTime: "10 minuti",
      cost: "€106.80"
    },
    {
      icon: Search,
      title: t("service.checkStatus.title"),
      description: t("service.checkStatus.description"),
      href: "/status-check",
      className: "bg-yellow-500",
      estimatedTime: "2 minuti",
      cost: t("common.free")
    },
    {
      icon: Calendar,
      title: t("service.appointments.title"),
      description: t("service.appointments.description"),
      href: "/appointments",
      className: "bg-purple-600",
      estimatedTime: t("common.immediate"),
      cost: t("common.free")
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[hsl(210,100%,25%)] to-[hsl(210,100%,40%)] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t("hero.subtitle")}
            </p>
            
            {/* Quick Action Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Link href="/license-renewal">
                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all cursor-pointer text-white">
                  <CardContent className="p-6 text-center">
                    <RotateCcw className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("quickAction.renewal")}</h3>
                    <p className="text-sm opacity-80">{t("quickAction.renewalDesc")}</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/status-check">
                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all cursor-pointer text-white">
                  <CardContent className="p-6 text-center">
                    <Search className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("quickAction.points")}</h3>
                    <p className="text-sm opacity-80">{t("quickAction.pointsDesc")}</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/appointments">
                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all cursor-pointer text-white">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t("quickAction.exam")}</h3>
                    <p className="text-sm opacity-80">{t("quickAction.examDesc")}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {t("services.available")}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {mainServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  className={service.className}
                  estimatedTime={service.estimatedTime}
                  cost={service.cost}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Document Status Check Section */}
      <section className="py-16 gov-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
                  {t("statusCheck.title")}
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  {t("statusCheck.description")}
                </p>
                
                <StatusCheckForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News and Updates Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {t("news.title")}
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">{t("common.imageNotAvailable")}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-gov-blue font-medium mb-2">15 Dicembre 2024</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">
                    {t("news.renewal.title")}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {t("news.renewal.description")}
                  </p>
                  <Button variant="link" className="text-gov-blue p-0">
                    {t("common.readMore")} →
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">{t("common.imageNotAvailable")}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-italian-green font-medium mb-2">10 Dicembre 2024</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">
                    {t("news.digital.title")}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {t("news.digital.description")}
                  </p>
                  <Button variant="link" className="text-gov-blue p-0">
                    {t("common.readMore")} →
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">{t("common.imageNotAvailable")}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-italian-red font-medium mb-2">5 Dicembre 2024</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">
                    {t("news.traffic.title")}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {t("news.traffic.description")}
                  </p>
                  <Button variant="link" className="text-gov-blue p-0">
                    {t("common.readMore")} →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact and Office Locations */}
      <section className="py-16 gov-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {t("contact.title")}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t("contact.info")}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="gov-blue text-white p-3 rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{t("contact.callCenter")}</h4>
                      <p className="text-gray-600">800-232323 (numero verde)</p>
                      <p className="text-sm text-gray-500">Lun-Ven: 8:00-18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="italian-green text-white p-3 rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-600">info@motorizzazione.gov.it</p>
                      <p className="text-sm text-gray-500">{t("contact.response48h")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white p-3 rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{t("contact.chat")}</h4>
                      <p className="text-gray-600">{t("contact.chatDesc")}</p>
                      <p className="text-sm text-gray-500">Lun-Ven: 9:00-17:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t("contact.offices")}</h3>
                
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">{t("common.imageNotAvailable")}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-gov-blue pl-4">
                    <h4 className="font-medium text-gray-900">Roma - Sede Centrale</h4>
                    <p className="text-gray-600 text-sm">Via Giuseppe Caraci, 36</p>
                    <p className="text-gray-600 text-sm">00157 Roma RM</p>
                  </div>

                  <div className="border-l-4 border-italian-green pl-4">
                    <h4 className="font-medium text-gray-900">Milano - Ufficio Regionale</h4>
                    <p className="text-gray-600 text-sm">Viale Fulvio Testi, 7</p>
                    <p className="text-gray-600 text-sm">20162 Milano MI</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-gray-900">Napoli - Ufficio Regionale</h4>
                    <p className="text-gray-600 text-sm">Centro Direzionale, Isola A6</p>
                    <p className="text-gray-600 text-sm">80143 Napoli NA</p>
                  </div>
                </div>

                <Button className="mt-6 gov-blue hover:bg-gov-blue text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t("contact.findOffice")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
