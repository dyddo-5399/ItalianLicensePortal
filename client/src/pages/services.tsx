import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { 
  FileText, 
  RotateCcw, 
  Search, 
  Calendar, 
  Copy, 
  CreditCard,
  Clock,
  Euro,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      id: "new-license",
      icon: FileText,
      title: t("service.newLicense.title"),
      description: t("service.newLicense.description"),
      href: "/license-application",
      color: "gov-blue",
      estimatedTime: "15 minuti",
      cost: "€73.50",
      status: "available",
      requirements: [
        "Documento di identità valido",
        "Certificato medico",
        "2 fototessere",
        "Codice fiscale"
      ]
    },
    {
      id: "renewal",
      icon: RotateCcw,
      title: t("service.renewLicense.title"),
      description: t("service.renewLicense.description"),
      href: "/license-renewal",
      color: "italian-green",
      estimatedTime: "10 minuti",
      cost: "€106.80",
      status: "available",
      requirements: [
        "Patente da rinnovare",
        "Certificato medico",
        "Documento di identità",
        "Fototessera recente"
      ]
    },
    {
      id: "duplicate",
      icon: Copy,
      title: "Duplicato Patente",
      description: "Richiedi un duplicato della patente in caso di smarrimento, furto o deterioramento",
      href: "#",
      color: "bg-orange-500",
      estimatedTime: "8 minuti",
      cost: "€26.20",
      status: "available",
      requirements: [
        "Denuncia di smarrimento/furto",
        "Documento di identità",
        "Fototessera",
        "Dichiarazione sostitutiva"
      ]
    },
    {
      id: "conversion",
      icon: FileText,
      title: "Conversione Patente",
      description: "Converti una patente estera in patente italiana secondo le normative UE",
      href: "#",
      color: "bg-blue-600",
      estimatedTime: "20 minuti",
      cost: "€40.00",
      status: "available",
      requirements: [
        "Patente estera originale",
        "Traduzione giurata",
        "Certificato di residenza",
        "Documento di identità"
      ]
    },
    {
      id: "points-check",
      icon: Search,
      title: t("service.checkStatus.title"),
      description: t("service.checkStatus.description"),
      href: "/status-check",
      color: "bg-yellow-500",
      estimatedTime: "2 minuti",
      cost: t("common.free"),
      status: "available",
      requirements: [
        "Numero patente",
        "Codice fiscale"
      ]
    },
    {
      id: "appointments",
      icon: Calendar,
      title: t("service.appointments.title"),
      description: t("service.appointments.description"),
      href: "/appointments",
      color: "bg-purple-600",
      estimatedTime: t("common.immediate"),
      cost: t("common.free"),
      status: "available",
      requirements: [
        "Codice fiscale",
        "Tipo di servizio",
        "Preferenza di orario"
      ]
    },
    {
      id: "medical-visit",
      icon: FileText,
      title: "Prenotazione Visita Medica",
      description: "Prenota una visita medica presso i centri convenzionati per il rinnovo patente",
      href: "#",
      color: "bg-green-600",
      estimatedTime: "5 minuti",
      cost: "€80.00 - €120.00",
      status: "available",
      requirements: [
        "Patente in scadenza",
        "Documento di identità",
        "Tessera sanitaria"
      ]
    },
    {
      id: "payment",
      icon: CreditCard,
      title: "Pagamenti Online",
      description: "Effettua pagamenti per pratiche, multe e tasse automobilistiche",
      href: "#",
      color: "bg-indigo-600",
      estimatedTime: "3 minuti",
      cost: "Variabile",
      status: "available",
      requirements: [
        "Numero pratica o multa",
        "Carta di credito/debito",
        "Codice fiscale"
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Disponibile</Badge>;
      case "maintenance":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Manutenzione</Badge>;
      case "unavailable":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Non disponibile</Badge>;
      default:
        return <Badge variant="secondary"><Info className="h-3 w-3 mr-1" />Sconosciuto</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gov-blue">Home</Link>
          <span className="mx-2">></span>
          <span className="text-gray-900">Servizi</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutti i Servizi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri tutti i servizi disponibili per la gestione della tua patente di guida. 
            Scegli il servizio di cui hai bisogno e completa la procedura online.
          </p>
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="border-gov-blue text-gov-blue">
              <FileText className="h-4 w-4 mr-2" />
              Tutti i servizi
            </Button>
            <Button variant="ghost">
              <Clock className="h-4 w-4 mr-2" />
              Rapidi (< 10 min)
            </Button>
            <Button variant="ghost">
              <Euro className="h-4 w-4 mr-2" />
              Gratuiti
            </Button>
            <Button variant="ghost">
              <CheckCircle className="h-4 w-4 mr-2" />
              Disponibili
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isAvailable = service.status === "available";
            
            return (
              <Card key={service.id} className={`hover:shadow-lg transition-all ${!isAvailable ? 'opacity-75' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${service.color} text-white p-3 rounded-lg`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Tempo stimato:
                      </span>
                      <span className="font-medium text-gray-700">{service.estimatedTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <Euro className="h-4 w-4 mr-1" />
                        Costo:
                      </span>
                      <span className="font-medium text-gray-700">{service.cost}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Documenti richiesti:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {service.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {isAvailable ? (
                    service.href.startsWith('#') ? (
                      <Button className={`w-full ${service.color} hover:opacity-90 text-white`} disabled>
                        Prossimamente disponibile
                      </Button>
                    ) : (
                      <Link href={service.href}>
                        <Button className={`w-full ${service.color} hover:opacity-90 text-white`}>
                          Inizia procedura
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Servizio non disponibile
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16">
          <Card className="gov-light-blue text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Hai bisogno di aiuto?</h2>
              <p className="mb-6 opacity-90">
                Se non trovi il servizio che cerchi o hai domande, contatta il nostro supporto clienti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Contatta il supporto
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Consulta le FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
