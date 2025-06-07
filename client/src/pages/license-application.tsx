import { useLanguage } from "@/hooks/use-language";
import LicenseApplicationForm from "@/components/forms/license-application-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  FileText, 
  Clock, 
  Euro, 
  Shield,
  AlertCircle,
  CheckCircle,
  Camera,
  CreditCard
} from "lucide-react";

export default function LicenseApplication() {
  const { t } = useLanguage();

  const requiredDocuments = [
    {
      icon: Shield,
      title: "Documento di Identità",
      description: "Carta d'identità o passaporto valido e in corso di validità",
      required: true
    },
    {
      icon: FileText,
      title: "Certificato Medico",
      description: "Certificato di idoneità psicofisica rilasciato da medico abilitato",
      required: true
    },
    {
      icon: Camera,
      title: "Fototessere",
      description: "2 fototessere recenti e conformi alle specifiche",
      required: true
    },
    {
      icon: FileText,
      title: "Codice Fiscale",
      description: "Tessera del codice fiscale o documento equivalente",
      required: true
    }
  ];

  const licenseTypes = [
    { code: "AM", description: "Ciclomotori fino a 50cc", age: "14 anni", exam: "Solo teorico" },
    { code: "A1", description: "Motocicli fino a 125cc", age: "16 anni", exam: "Teorico + Pratico" },
    { code: "A2", description: "Motocicli fino a 35kW", age: "18 anni", exam: "Teorico + Pratico" },
    { code: "A", description: "Tutti i motocicli", age: "24 anni", exam: "Teorico + Pratico" },
    { code: "B", description: "Autovetture fino a 3.5t", age: "18 anni", exam: "Teorico + Pratico" },
    { code: "C", description: "Autocarri oltre 3.5t", age: "21 anni", exam: "Teorico + Pratico" }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Compila la domanda",
      description: "Inserisci i tuoi dati personali e scegli il tipo di patente"
    },
    {
      step: 2,
      title: "Carica i documenti",
      description: "Allega tutti i documenti richiesti in formato digitale"
    },
    {
      step: 3,
      title: "Effettua il pagamento",
      description: "Paga le tasse governative e i diritti di segreteria"
    },
    {
      step: 4,
      title: "Verifica e invia",
      description: "Controlla tutti i dati e invia la domanda"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gov-blue">Home</Link>
          <span className="mx-2">></span>
          <Link href="/services" className="hover:text-gov-blue">Servizi</Link>
          <span className="mx-2">></span>
          <span className="text-gray-900">Richiesta Patente</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar with Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gov-blue">
                  <FileText className="h-5 w-5 mr-2" />
                  Informazioni Servizio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Tempo stimato
                  </span>
                  <Badge variant="secondary">15 minuti</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <Euro className="h-4 w-4 mr-1" />
                    Costo totale
                  </span>
                  <Badge variant="secondary">€73.50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Pagamento
                  </span>
                  <Badge className="italian-green text-white">Online</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gov-blue">Documenti Richiesti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requiredDocuments.map((doc, index) => {
                    const IconComponent = doc.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <IconComponent className="h-4 w-4 text-gov-blue" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{doc.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                          {doc.required && (
                            <Badge variant="outline" className="text-xs mt-1">Obbligatorio</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gov-blue">Processo di Richiesta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-gov-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Richiesta Nuova Patente di Guida</h1>
              <p className="text-gray-600">
                Compila il modulo per richiedere una nuova patente di guida. Assicurati di avere tutti i documenti richiesti prima di iniziare.
              </p>
            </div>

            {/* Important Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Attenzione:</strong> Prima di presentare la domanda, assicurati di aver superato l'esame teorico presso una scuola guida autorizzata. 
                La domanda sarà elaborata solo dopo la verifica di tutti i documenti.
              </AlertDescription>
            </Alert>

            {/* License Types Information */}
            <Card>
              <CardHeader>
                <CardTitle>Tipi di Patente Disponibili</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {licenseTypes.map((type, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:border-gov-blue transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gov-blue text-lg">Patente {type.code}</h4>
                        <Badge variant="outline">{type.age}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Età minima: {type.age}</span>
                        <span>•</span>
                        <span>{type.exam}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gov-blue">
                  <FileText className="h-5 w-5 mr-2" />
                  Modulo di Richiesta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LicenseApplicationForm />
              </CardContent>
            </Card>

            {/* Success Notice */}
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Una volta inviata la domanda, riceverai un numero di pratica per monitorare lo stato della tua richiesta. 
                Il tempo di elaborazione è di circa 15-30 giorni lavorativi.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
