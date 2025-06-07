import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  Building,
  Globe,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      message: ""
    }
  });

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Center",
      description: "Assistenza telefonica per informazioni generali",
      contact: "800-232323 (numero verde)",
      hours: "Lun-Ven: 8:00-18:00",
      responseTime: "Immediata",
      availability: "available"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Supporto via email per richieste dettagliate",
      contact: "info@motorizzazione.gov.it",
      hours: "24/7",
      responseTime: "Entro 48 ore",
      availability: "available"
    },
    {
      icon: MessageSquare,
      title: "Chat Online",
      description: "Assistenza in tempo reale con operatori specializzati",
      contact: "Chat disponibile sul sito",
      hours: "Lun-Ven: 9:00-17:00",
      responseTime: "Immediata",
      availability: "busy"
    },
    {
      icon: Building,
      title: "Uffici Territoriali",
      description: "Assistenza presso gli uffici della Motorizzazione",
      contact: "Vedi elenco uffici",
      hours: "Lun-Ven: 8:30-16:30",
      responseTime: "Su appuntamento",
      availability: "available"
    }
  ];

  const offices = [
    {
      name: "Roma - Sede Centrale",
      address: "Via Giuseppe Caraci, 36",
      city: "00157 Roma RM",
      phone: "06-41432111",
      email: "roma.centrale@motorizzazione.gov.it",
      services: ["Tutti i servizi", "Direzione Generale", "Ufficio Relazioni Pubblico"],
      manager: "Dott.ssa Maria Rossi"
    },
    {
      name: "Milano - Ufficio Regionale",
      address: "Viale Fulvio Testi, 7",
      city: "20162 Milano MI",
      phone: "02-66708111",
      email: "milano@motorizzazione.gov.it",
      services: ["Patenti", "Carta di Circolazione", "Revisioni", "Esami"],
      manager: "Ing. Giuseppe Bianchi"
    },
    {
      name: "Napoli - Ufficio Regionale",
      address: "Centro Direzionale, Isola A6",
      city: "80143 Napoli NA",
      phone: "081-7941111",
      email: "napoli@motorizzazione.gov.it",
      services: ["Patenti", "Documenti di Circolazione", "Autoscuole"],
      manager: "Dott. Antonio Verdi"
    },
    {
      name: "Torino - Ufficio Provinciale",
      address: "Corso Regina Margherita, 300",
      city: "10144 Torino TO",
      phone: "011-4338111",
      email: "torino@motorizzazione.gov.it",
      services: ["Patenti", "Revisioni", "Omologazioni"],
      manager: "Ing. Laura Neri"
    }
  ];

  const inquiryCategories = [
    { value: "license-application", label: "Richiesta Patente" },
    { value: "license-renewal", label: "Rinnovo Patente" },
    { value: "license-points", label: "Punti Patente" },
    { value: "appointments", label: "Appuntamenti" },
    { value: "documents", label: "Documenti e Certificati" },
    { value: "exams", label: "Esami di Guida" },
    { value: "technical-support", label: "Supporto Tecnico" },
    { value: "complaints", label: "Reclami" },
    { value: "other", label: "Altro" }
  ];

  const onSubmit = (data: ContactFormData) => {
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Richiesta inviata!",
        description: "Riceverai una risposta entro 48 ore all'indirizzo email fornito.",
      });
      form.reset();
    }, 1000);
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Disponibile</Badge>;
      case "busy":
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Occupato</Badge>;
      case "unavailable":
        return <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Non disponibile</Badge>;
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gov-blue">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">{t("nav.contact")}</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contatta il nostro supporto per qualsiasi domanda o assistenza. 
            Siamo qui per aiutarti con tutti i servizi della Motorizzazione Civile.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[hsl(210,100%,25%)]">Canali di Contatto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const IconComponent = method.icon;
                    return (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[hsl(210,100%,25%)] transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <IconComponent className="h-4 w-4 text-[hsl(210,100%,25%)]" />
                            </div>
                            <h4 className="font-semibold text-gray-900">{method.title}</h4>
                          </div>
                          {getAvailabilityBadge(method.availability)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex justify-between">
                            <span>Contatto:</span>
                            <span className="font-medium text-gray-700">{method.contact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Orari:</span>
                            <span className="font-medium text-gray-700">{method.hours}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risposta:</span>
                            <span className="font-medium text-gray-700">{method.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Emergenze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Per emergenze stradali o situazioni urgenti contatta:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-red-600" />
                    <span className="font-bold">112</span>
                    <span className="text-red-600">- Numero Unico Emergenze</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-red-600" />
                    <span className="font-bold">113</span>
                    <span className="text-red-600">- Polizia di Stato</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Richiesta Inviata con Successo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-green-700 mb-4">
                      La tua richiesta è stata inviata correttamente. 
                      Riceverai una risposta dal nostro team entro 48 ore lavorative.
                    </p>
                    <p className="text-sm text-green-600 mb-6">
                      Numero di riferimento: #REQ{Date.now().toString().slice(-6)}
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-green-600 text-green-700 hover:bg-green-100"
                    >
                      Invia Nuova Richiesta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-[hsl(210,100%,25%)]">
                    <Send className="h-5 w-5 mr-2" />
                    Invia una Richiesta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome e Cognome *</Label>
                        <Input
                          id="name"
                          {...form.register("name", { required: true })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email", { required: true })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefono</Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria Richiesta *</Label>
                        <Select onValueChange={(value) => form.setValue("category", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleziona categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Oggetto *</Label>
                      <Input
                        id="subject"
                        {...form.register("subject", { required: true })}
                        placeholder="Riassumi brevemente la tua richiesta"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Messaggio *</Label>
                      <Textarea
                        id="message"
                        {...form.register("message", { required: true })}
                        placeholder="Descrivi dettagliatamente la tua richiesta..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    {/* Privacy Notice */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-1">Informativa Privacy</p>
                          <p>
                            I tuoi dati personali saranno trattati secondo il GDPR per fornire assistenza. 
                            Non saranno condivisi con terze parti senza consenso.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[hsl(210,100%,25%)] hover:bg-blue-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Invia Richiesta
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Office Locations */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Uffici Territoriali</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-[hsl(210,100%,25%)]">
                    <Building className="h-5 w-5 mr-2" />
                    {office.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{office.address}</p>
                        <p className="text-sm text-gray-600">{office.city}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{office.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{office.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Servizi Disponibili:</h4>
                      <div className="flex flex-wrap gap-1">
                        {office.services.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Responsabile: {office.manager}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href="/appointments">
                        <Button size="sm" className="bg-[hsl(140,100%,28%)] hover:bg-green-700 text-white">
                          Prenota Appuntamento
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        Indicazioni
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-[hsl(210,100%,25%)] to-[hsl(210,100%,40%)] text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Domande Frequenti</h2>
              <p className="mb-6 opacity-90">
                Prima di contattarci, controlla se la tua domanda ha già una risposta nelle FAQ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  <Globe className="h-4 w-4 mr-2" />
                  Consulta le FAQ
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Avvia Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
