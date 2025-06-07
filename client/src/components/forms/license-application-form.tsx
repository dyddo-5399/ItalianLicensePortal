import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { insertLicenseApplicationSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Upload, FileText, X } from "lucide-react";

const applicationFormSchema = z.object({
  // User data
  firstName: z.string().min(1, "Nome richiesto"),
  lastName: z.string().min(1, "Cognome richiesto"),
  fiscalCode: z.string().min(16, "Codice fiscale deve essere di 16 caratteri").max(16),
  birthDate: z.string().min(1, "Data di nascita richiesta"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(1, "Telefono richiesto"),
  address: z.string().min(1, "Indirizzo richiesto"),
  city: z.string().min(1, "Città richiesta"),
  province: z.string().min(1, "Provincia richiesta"),
  postalCode: z.string().min(1, "CAP richiesto"),
  // Application data
  licenseType: z.string().min(1, "Tipo di patente richiesto"),
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini")
});

type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export default function LicenseApplicationForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fiscalCode: "",
      birthDate: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      licenseType: "",
      acceptTerms: false
    }
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      // First create or get user
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        fiscalCode: data.fiscalCode,
        birthDate: data.birthDate,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode
      };

      let userResponse;
      try {
        // Try to get existing user
        userResponse = await apiRequest("GET", `/api/users/fiscal-code/${data.fiscalCode}`);
      } catch {
        // Create new user if not found
        userResponse = await apiRequest("POST", "/api/users", userData);
      }

      const user = await userResponse.json();

      // Create application with file upload
      const formData = new FormData();
      formData.append("userId", user.id.toString());
      formData.append("licenseType", data.licenseType);
      formData.append("status", "pending");

      // Add uploaded files
      uploadedFiles.forEach(file => {
        formData.append('documents', file);
      });

      return apiRequest("POST", "/api/license-applications", formData);
    },
    onSuccess: async (response) => {
      const application = await response.json();
      toast({
        title: "Richiesta inviata con successo!",
        description: `Numero pratica: ${application.practiceNumber}. Riceverai aggiornamenti via email.`,
      });
      form.reset();
      setUploadedFiles([]);
      queryClient.invalidateQueries({ queryKey: ['/api/license-applications'] });
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

  const onSubmit = (data: ApplicationFormData) => {
    applicationMutation.mutate(data);
  };

  const licenseTypes = [
    { value: "AM", label: "AM - Ciclomotori" },
    { value: "A1", label: "A1 - Motocicli 125cc" },
    { value: "A2", label: "A2 - Motocicli 35kW" },
    { value: "A", label: "A - Tutti i motocicli" },
    { value: "B", label: "B - Autovetture" },
    { value: "C", label: "C - Autocarri" }
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dati Personali</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t("form.firstName")} *</Label>
            <Input
              id="firstName"
              {...form.register("firstName")}
              className="mt-1"
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">{t("form.lastName")} *</Label>
            <Input
              id="lastName"
              {...form.register("lastName")}
              className="mt-1"
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fiscalCode">{t("form.fiscalCode")} *</Label>
            <Input
              id="fiscalCode"
              placeholder="RSSMRO85M01H501Z"
              {...form.register("fiscalCode")}
              className="mt-1"
            />
            {form.formState.errors.fiscalCode && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.fiscalCode.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="birthDate">{t("form.birthDate")} *</Label>
            <Input
              id="birthDate"
              type="date"
              {...form.register("birthDate")}
              className="mt-1"
            />
            {form.formState.errors.birthDate && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.birthDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">{t("form.email")} *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">{t("form.phone")} *</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              className="mt-1"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Indirizzo di Residenza</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">{t("form.address")} *</Label>
            <Input
              id="address"
              {...form.register("address")}
              className="mt-1"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="city">{t("form.city")} *</Label>
            <Input
              id="city"
              {...form.register("city")}
              className="mt-1"
            />
            {form.formState.errors.city && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.city.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="province">{t("form.province")} *</Label>
            <Input
              id="province"
              {...form.register("province")}
              className="mt-1"
            />
            {form.formState.errors.province && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.province.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="postalCode">{t("form.postalCode")} *</Label>
            <Input
              id="postalCode"
              {...form.register("postalCode")}
              className="mt-1"
            />
            {form.formState.errors.postalCode && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.postalCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* License Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tipo di Patente</h3>
        
        <div>
          <Label htmlFor="licenseType">{t("form.licenseType")} *</Label>
          <Select onValueChange={(value) => form.setValue("licenseType", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t("form.selectLicenseType")} />
            </SelectTrigger>
            <SelectContent>
              {licenseTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.licenseType && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.licenseType.message}
            </p>
          )}
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Caricamento Documenti</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[hsl(210,100%,25%)] transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Carica i documenti richiesti (PDF, JPG, PNG - max 5MB ciascuno)
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
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={form.watch("acceptTerms")}
            onCheckedChange={(checked) => form.setValue("acceptTerms", checked as boolean)}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-5">
            {t("form.acceptTerms")} e autorizzo il trattamento dei miei dati personali 
            secondo il {t("form.privacyPolicy")}.
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
          className="bg-[hsl(210,100%,25%)] hover:bg-blue-700 text-white px-8"
          disabled={applicationMutation.isPending}
        >
          {applicationMutation.isPending ? "Invio in corso..." : t("common.submit")}
        </Button>
      </div>
    </form>
  );
}
