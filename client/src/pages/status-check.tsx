import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import StatusCheckForm from "@/components/forms/status-check-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  FileText, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Info,
  Award,
  TrendingUp
} from "lucide-react";

interface PracticeStatusResult {
  type: 'application' | 'renewal';
  data: {
    practiceNumber: string;
    status: string;
    submittedAt: string;
    updatedAt: string;
    notes?: string;
  };
}

interface LicenseStatusResult {
  licenseNumber: string;
  points: number;
  expiryDate: string;
  isValid: boolean;
  violations: string[];
  updatedAt: string;
}

export default function StatusCheck() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [practiceResult, setPracticeResult] = useState<PracticeStatusResult | null>(null);
  const [licenseResult, setLicenseResult] = useState<LicenseStatusResult | null>(null);

  const practiceForm = useForm({
    defaultValues: {
      practiceNumber: "",
      fiscalCode: ""
    }
  });

  const licenseForm = useForm({
    defaultValues: {
      licenseNumber: "",
      fiscalCode: ""
    }
  });

  const practiceCheckMutation = useMutation({
    mutationFn: async (data: { practiceNumber: string; fiscalCode: string }) => {
      return apiRequest("POST", "/api/practice-status/check", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      setPracticeResult(result);
      setLicenseResult(null);
    },
    onError: (error) => {
      toast({
        title: "Pratica non trovata",
        description: "Verifica che il numero di pratica e il codice fiscale siano corretti.",
        variant: "destructive",
      });
      setPracticeResult(null);
    }
  });

  const licenseCheckMutation = useMutation({
    mutationFn: async (data: { licenseNumber: string; fiscalCode: string }) => {
      return apiRequest("POST", "/api/license-status/check", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      setLicenseResult(result);
      setPracticeResult(null);
    },
    onError: (error) => {
      toast({
        title: "Patente non trovata",
        description: "Verifica che il numero di patente e il codice fiscale siano corretti.",
        variant: "destructive",
      });
      setLicenseResult(null);
    }
  });

  const onPracticeSubmit = (data: { practiceNumber: string; fiscalCode: string }) => {
    practiceCheckMutation.mutate(data);
  };

  const onLicenseSubmit = (data: { licenseNumber: string; fiscalCode: string }) => {
    licenseCheckMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />In attesa</Badge>;
      case "in_review":
        return <Badge className="bg-blue-500 text-white"><Search className="h-3 w-3 mr-1" />In verifica</Badge>;
      case "approved":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Approvata</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Rifiutata</Badge>;
      default:
        return <Badge variant="secondary"><Info className="h-3 w-3 mr-1" />Sconosciuto</Badge>;
    }
  };

  const getPointsStatus = (points: number) => {
    if (points >= 15) {
      return { color: "text-green-600", bg: "bg-green-100", status: "Ottimo" };
    } else if (points >= 10) {
      return { color: "text-yellow-600", bg: "bg-yellow-100", status: "Attenzione" };
    } else {
      return { color: "text-red-600", bg: "bg-red-100", status: "Critico" };
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gov-blue">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/services" className="hover:text-gov-blue">Servizi</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Verifica Stato</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifica Stato</h1>
            <p className="text-gray-600">
              Controlla lo stato delle tue pratiche o verifica la validità e i punti della tua patente
            </p>
          </div>

          {/* Search Tabs */}
          <Tabs defaultValue="practice" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Stato Pratica
              </TabsTrigger>
              <TabsTrigger value="license" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Stato Patente
              </TabsTrigger>
            </TabsList>

            {/* Practice Status Check */}
            <TabsContent value="practice">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gov-blue">
                    <FileText className="h-5 w-5 mr-2" />
                    Verifica Stato Pratica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Inserisci il numero di pratica e il tuo codice fiscale per verificare lo stato di avanzamento della richiesta
                  </p>
                  
                  <form onSubmit={practiceForm.handleSubmit(onPracticeSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="practiceNumber">Numero Pratica</Label>
                        <Input
                          id="practiceNumber"
                          placeholder="PA202412345678"
                          {...practiceForm.register("practiceNumber", { required: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fiscalCode">Codice Fiscale</Label>
                        <Input
                          id="fiscalCode"
                          placeholder="RSSMRO85M01H501Z"
                          {...practiceForm.register("fiscalCode", { required: true })}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="gov-blue hover:bg-gov-blue text-white w-full"
                      disabled={practiceCheckMutation.isPending}
                    >
                      {practiceCheckMutation.isPending ? (
                        <>
                          <Search className="h-4 w-4 mr-2 animate-spin" />
                          Verifica in corso...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Verifica Stato
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* License Status Check */}
            <TabsContent value="license">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gov-blue">
                    <Shield className="h-5 w-5 mr-2" />
                    Verifica Stato Patente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Inserisci il numero della tua patente e il codice fiscale per verificare validità e punti residui
                  </p>
                  
                  <form onSubmit={licenseForm.handleSubmit(onLicenseSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="licenseNumber">Numero Patente</Label>
                        <Input
                          id="licenseNumber"
                          placeholder="IT123456789"
                          {...licenseForm.register("licenseNumber", { required: true })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fiscalCodeLicense">Codice Fiscale</Label>
                        <Input
                          id="fiscalCodeLicense"
                          placeholder="RSSMRO85M01H501Z"
                          {...licenseForm.register("fiscalCode", { required: true })}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="gov-blue hover:bg-gov-blue text-white w-full"
                      disabled={licenseCheckMutation.isPending}
                    >
                      {licenseCheckMutation.isPending ? (
                        <>
                          <Search className="h-4 w-4 mr-2 animate-spin" />
                          Verifica in corso...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Verifica Patente
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Practice Status Result */}
          {practiceResult && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gov-blue" />
                    Risultato Verifica Pratica
                  </span>
                  {getStatusBadge(practiceResult.data.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Informazioni Pratica</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Numero Pratica:</span>
                        <span className="font-medium">{practiceResult.data.practiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">
                          {practiceResult.type === 'application' ? 'Richiesta Patente' : 'Rinnovo Patente'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Invio:</span>
                        <span className="font-medium">
                          {new Date(practiceResult.data.submittedAt).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ultimo Aggiornamento:</span>
                        <span className="font-medium">
                          {new Date(practiceResult.data.updatedAt).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Stato Attuale</h3>
                    <div className="space-y-3">
                      {practiceResult.data.status === 'pending' && (
                        <Alert>
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            La tua pratica è stata ricevuta ed è in attesa di essere elaborata. 
                            I tempi di elaborazione sono di circa 15-30 giorni lavorativi.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {practiceResult.data.status === 'in_review' && (
                        <Alert>
                          <Search className="h-4 w-4" />
                          <AlertDescription>
                            I tuoi documenti sono in fase di verifica. Ti contatteremo in caso di 
                            documentazione mancante o per eventuali chiarimenti.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {practiceResult.data.status === 'approved' && (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            La tua pratica è stata approvata! La nuova patente ti sarà recapitata 
                            nei prossimi giorni lavorativi.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {practiceResult.data.notes && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Note:</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {practiceResult.data.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* License Status Result */}
          {licenseResult && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gov-blue" />
                  Stato Patente di Guida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* License Validity */}
                  <div className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      licenseResult.isValid ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {licenseResult.isValid ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">Validità</h3>
                    <p className={`text-sm ${licenseResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {licenseResult.isValid ? 'Valida' : 'Non Valida'}
                    </p>
                  </div>

                  {/* Points Status */}
                  <div className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      getPointsStatus(licenseResult.points).bg
                    }`}>
                      <Star className={`h-8 w-8 ${getPointsStatus(licenseResult.points).color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Punti</h3>
                    <p className={`text-lg font-bold ${getPointsStatus(licenseResult.points).color}`}>
                      {licenseResult.points}/20
                    </p>
                    <p className={`text-xs ${getPointsStatus(licenseResult.points).color}`}>
                      {getPointsStatus(licenseResult.points).status}
                    </p>
                  </div>

                  {/* Expiry Date */}
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Scadenza</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(licenseResult.expiryDate).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="mt-8 pt-6 border-t">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Informazioni Dettagliate</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Numero Patente:</span>
                          <span className="font-medium">{licenseResult.licenseNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Punti Attuali:</span>
                          <span className="font-medium">{licenseResult.points}/20</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data Scadenza:</span>
                          <span className="font-medium">
                            {new Date(licenseResult.expiryDate).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ultimo Aggiornamento:</span>
                          <span className="font-medium">
                            {new Date(licenseResult.updatedAt).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Violations */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Infrazioni Recenti</h3>
                      {licenseResult.violations && licenseResult.violations.length > 0 ? (
                        <div className="space-y-2">
                          {licenseResult.violations.map((violation, index) => (
                            <div key={index} className="text-sm bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                              {violation}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                          <CheckCircle className="h-4 w-4 inline mr-2" />
                          Nessuna infrazione registrata
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t flex flex-wrap gap-4">
                  <Link href="/license-renewal">
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rinnova Patente
                    </Button>
                  </Link>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recupera Punti
                  </Button>
                  <Button variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    Storico Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gov-blue">
                <Info className="h-5 w-5 mr-2" />
                Hai bisogno di aiuto?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Non trovi la tua pratica?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Verifica che il numero di pratica e il codice fiscale siano inseriti correttamente. 
                    Il numero di pratica viene fornito al momento dell'invio della domanda.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline">Contatta il supporto</Button>
                  </Link>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Problemi con la patente?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Se riscontri problemi con i punti o la validità della patente, 
                    puoi richiedere una verifica presso i nostri uffici.
                  </p>
                  <Link href="/appointments">
                    <Button variant="outline">Prenota appuntamento</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
