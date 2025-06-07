import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertLicenseRenewalSchema } from "@shared/schema";
import { z } from "zod";
import { 
  RotateCcw, 
  Clock, 
  Euro, 
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  Calendar,
  Shield
} from "lucide-react";

const renewalFormSchema = insertLicenseRenewalSchema.extend({
  documents: z.array(z.any()).optional(),
  medicalCertificate: z.any().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini")
});

type RenewalFormData = z.infer<typeof renewalFormSchema>;

export default function LicenseRenewal() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<RenewalFormData>({
    resolver: zodResolver(renewalFormSchema),
    defaultValues: {
      userId: 1, // In a real app, this would come from auth context
      currentLicenseNumber: "",
      expiryDate: "",
      status: "pending",
      documents: [],
      medicalCertificate: "",
    }
  });

  const renewalMutation = useMutation({
    mutationFn: async (data: RenewalFormData) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'documents' && key !== 'medicalCertificate' && key !== 'acceptTerms') {
          formData.append(key, value as string);
        }
      });

      // Add files
      uploadedFiles.forEach(file => {
        formData.append('documents', file);
      });

      return apiRequest("POST", "/api/license-renewals", formData);
    },
    onSuccess: async (response) => {
      const renewal = await response.json();
      toast({
        title: "Richiesta inviata con successo!",
        description: `Numero pratica: ${renewal.practiceNumber}. Riceverai aggiornamenti via email.`,
      });
      form.reset();
      setUploadedFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Errore nell'invio",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: RenewalFormData) => {
    renewalMutation.mutate(data);
  };

  const renewalSteps = [
    {
      step: 1,
      title: "Inserisci dati patente",
      description: "Numero patente e data di scadenza"
    },
    {
      step: 2,
      title: "Carica documenti",
      description: "Certificato medico e documento di identità"
    },
    {
      step: 3,
      title: "Conferma e paga",
      description: "Verifica i dati e procedi al pagamento"
    }
  ];

  const requiredDocuments = [
    "Patente di guida in scadenza",
    "Certificato medico di idoneità psicofisica",
    "Documento di identità valido",
    "Fototessera recente (35x45mm)"
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gov-blue">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/services" className="hover:text-gov-blue">Servizi</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Rinnovo Patente</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-italian-green">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Rinnovo Patente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Tempo stimato
                  </span>
                  <Badge variant="secondary">10 minuti</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-gray-600">
                    <Euro className="h-4 w-4 mr-1" />
                    Costo totale
                  </span>
                  <Badge variant="secondary">€106.80</Badge>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• Diritti DTT: €10.20</div>
                  <div>• Imposta di bollo: €16.00</div>
                  <div>• Diritti Motorizzazione: €9.00</div>
                  <div>• Visita medica: €71.60</div>
                </div>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-italian-green">Processo di Rinnovo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {renewalSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="italian-green text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
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

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-italian-green">Documenti Necessari</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Rinnovo Patente di Guida</h1>
              <p className="text-gray-600">
                Rinnova la tua patente di guida online prima della scadenza. La procedura è semplice e veloce.
              </p>
            </div>

            {/* Important Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Il rinnovo deve essere effettuato entro 4 anni dalla scadenza per patenti di categoria B. 
                Per altri tipi di patente, consulta le specifiche normative.
              </AlertDescription>
            </Alert>

            {/* Renewal Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-italian-green">
                  <FileText className="h-5 w-5 mr-2" />
                  Modulo di Rinnovo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Current License Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informazioni Patente Attuale</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentLicenseNumber">Numero Patente *</Label>
                        <Input
                          id="currentLicenseNumber"
                          placeholder="IT123456789"
                          {...form.register("currentLicenseNumber")}
                          className="mt-1"
                        />
                        {form.formState.errors.currentLicenseNumber && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.currentLicenseNumber.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="expiryDate">Data di Scadenza *</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          {...form.register("expiryDate")}
                          className="mt-1"
                        />
                        {form.formState.errors.expiryDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.expiryDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Caricamento Documenti</h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-italian-green transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Carica i documenti richiesti (PDF, JPG, PNG - max 5MB)
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" className="mt-2">
                          Seleziona File
                        </Button>
                      </Label>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">File caricati:</h4>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Rimuovi
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Medical Certificate Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Certificato Medico</h3>
                    <Alert className="border-blue-200 bg-blue-50">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Il certificato medico deve essere rilasciato da un medico abilitato e non può essere più vecchio di 3 mesi.
                        Puoi effettuare la visita presso i nostri centri convenzionati.
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-4">
                      <Button type="button" variant="outline" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Prenota Visita Medica
                      </Button>
                      <span className="text-sm text-gray-600">oppure carica certificato esistente</span>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        {...form.register("acceptTerms")}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm leading-5">
                        Dichiaro di aver letto e accettato i{" "}
                        <Link href="#" className="text-italian-green hover:underline">
                          termini e condizioni del servizio
                        </Link>{" "}
                        e autorizzo il trattamento dei miei dati personali secondo il{" "}
                        <Link href="#" className="text-italian-green hover:underline">
                          GDPR
                        </Link>.
                      </Label>
                    </div>
                    {form.formState.errors.acceptTerms && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between items-center pt-6 border-t">
                    <Button type="button" variant="outline">
                      Salva Bozza
                    </Button>
                    <Button
                      type="submit"
                      className="italian-green hover:bg-italian-green text-white px-8"
                      disabled={renewalMutation.isPending}
                    >
                      {renewalMutation.isPending ? "Invio in corso..." : "Procedi al Pagamento"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Success Information */}
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Dopo l'invio della richiesta e il completamento del pagamento, la tua nuova patente sarà elaborata entro 10 giorni lavorativi 
                e ti sarà recapitata all'indirizzo indicato.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
