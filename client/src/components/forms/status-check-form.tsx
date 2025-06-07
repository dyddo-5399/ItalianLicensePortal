import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Search } from "lucide-react";

interface StatusCheckFormData {
  practiceNumber: string;
  fiscalCode: string;
}

export default function StatusCheckForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [result, setResult] = useState<any>(null);

  const form = useForm<StatusCheckFormData>({
    defaultValues: {
      practiceNumber: "",
      fiscalCode: ""
    }
  });

  const statusCheckMutation = useMutation({
    mutationFn: async (data: StatusCheckFormData) => {
      return apiRequest("POST", "/api/practice-status/check", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      setResult(result);
      toast({
        title: "Stato trovato",
        description: "Stato della pratica recuperato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Pratica non trovata",
        description: "Verifica che il numero di pratica e il codice fiscale siano corretti.",
        variant: "destructive",
      });
      setResult(null);
    }
  });

  const onSubmit = (data: StatusCheckFormData) => {
    statusCheckMutation.mutate(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="practiceNumber">Numero Pratica</Label>
            <Input
              id="practiceNumber"
              placeholder="Es: PA202412345678"
              {...form.register("practiceNumber", { required: true })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fiscalCode">{t("form.fiscalCode")}</Label>
            <Input
              id="fiscalCode"
              placeholder="RSSMRO85M01H501Z"
              {...form.register("fiscalCode", { required: true })}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="text-center">
          <Button
            type="submit"
            className="bg-[hsl(210,100%,25%)] hover:bg-blue-700 text-white px-8 py-3"
            disabled={statusCheckMutation.isPending}
          >
            {statusCheckMutation.isPending ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Verifica in corso...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {t("common.search")}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <div>
              <h5 className="font-medium text-green-800">
                Pratica N. {result.data.practiceNumber}
              </h5>
              <p className="text-sm text-green-600">
                Stato: {result.data.status}
              </p>
              <p className="text-xs text-green-500 mt-1">
                Ultimo aggiornamento: {new Date(result.data.updatedAt).toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
