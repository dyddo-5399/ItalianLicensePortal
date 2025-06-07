import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Building,
  Users,
  Star
} from "lucide-react";

interface AppointmentFormData {
  userId: number;
  officeLocation: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
}

export default function Appointments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  const form = useForm<AppointmentFormData>({
    defaultValues: {
      userId: 1, // In a real app, this would come from auth context
      officeLocation: "",
      appointmentDate: "",
      appointmentTime: "",
      serviceType: ""
    }
  });

  const offices = [
    {
      id: "roma-centro",
      name: "Motorizzazione Roma Centro",
      address: "Via Circonvallazione Ostiense, 191, Roma",
      phone: "06-5144981",
      hours: "8:30-16:30",
      status: "open",
      nextSlot: "Mar 28/11",
      rating: 4.2,
      services: ["Patenti", "Carta di Circolazione", "Revisioni"]
    },
    {
      id: "roma-nord",
      name: "Motorizzazione Roma Nord",
      address: "Via Salaria, 1027, Roma",
      phone: "06-8841234",
      hours: "8:30-16:30",
      status: "busy",
      nextSlot: "Ven 01/12",
      rating: 4.0,
      services: ["Patenti", "Esami di Guida", "Conversioni"]
    },
    {
      id: "milano-centrale",
      name: "Motorizzazione Milano Centrale",
      address: "Viale Fulvio Testi, 7, Milano",
      phone: "02-6767890",
      hours: "8:30-16:30",
      status: "open",
      nextSlot: "Mer 29/11",
      rating: 4.5,
      services: ["Tutti i servizi"]
    }
  ];

  const serviceTypes = [
    { value: "license-application", label: "Richiesta Patente" },
    { value: "license-renewal", label: "Rinnovo Patente" },
    { value: "license-duplicate", label: "Duplicato Patente" },
    { value: "medical-exam", label: "Visita Medica" },
    { value: "practical-exam", label: "Esame Pratico" },
    { value: "document-verification", label: "Verifica Documenti" }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00"
  ];

  const appointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      return apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: async (response) => {
      const appointment = await response.json();
      setBookedAppointment(appointment);
      toast({
        title: "Appuntamento prenotato!",
        description: `Appuntamento confermato per il ${appointment.appointmentDate} alle ${appointment.appointmentTime}`,
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Errore nella prenotazione",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: AppointmentFormData) => {
    appointmentMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Disponibile</Badge>;
      case "busy":
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Occupato</Badge>;
      case "closed":
        return <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Chiuso</Badge>;
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
    }
  };

  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
          dayName: date.toLocaleDateString('it-IT', { weekday: 'short' }),
          available: Math.random() > 0.3 // Random availability for demo
        });
      }
    }
    
    return days;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gov-blue">Home</Link>
          <span className="mx-2">></span>
          <Link href="/services" className="hover:text-gov-blue">Servizi</Link>
          <span className="mx-2">></span>
          <span className="text-gray-900">{t("nav.appointments")}</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prenotazione Appuntamenti</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prenota un appuntamento presso gli uffici della Motorizzazione Civile per servizi che richiedono la presenza fisica
          </p>
        </div>

        {bookedAppointment ? (
          /* Success State */
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Appuntamento Confermato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Ufficio:</strong>
                      <p>{bookedAppointment.officeLocation}</p>
                    </div>
                    <div>
                      <strong>Servizio:</strong>
                      <p>{bookedAppointment.serviceType}</p>
                    </div>
                    <div>
                      <strong>Data:</strong>
                      <p>{new Date(bookedAppointment.appointmentDate).toLocaleDateString('it-IT')}</p>
                    </div>
                    <div>
                      <strong>Orario:</strong>
                      <p>{bookedAppointment.appointmentTime}</p>
                    </div>
                  </div>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Importante:</strong> Porta con te tutti i documenti richiesti. 
                      Riceverai una email di conferma con i dettagli dell'appuntamento.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4">
                    <Button onClick={() => setBookedAppointment(null)} variant="outline">
                      Prenota Altro Appuntamento
                    </Button>
                    <Button className="bg-[hsl(210,100%,25%)] hover:bg-blue-700 text-white">
                      Scarica Conferma
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Office Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-[hsl(210,100%,25%)]">
                    <Building className="h-5 w-5 mr-2" />
                    Seleziona Ufficio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offices.map((office) => (
                      <div
                        key={office.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedOffice === office.id
                            ? 'border-[hsl(210,100%,25%)] bg-blue-50'
                            : 'border-gray-200 hover:border-[hsl(210,100%,25%)]'
                        }`}
                        onClick={() => {
                          setSelectedOffice(office.id);
                          form.setValue("officeLocation", office.name);
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{office.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {office.address}
                            </p>
                          </div>
                          {getStatusBadge(office.status)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {office.phone}
                            </span>
                            <span className="flex items-center text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {office.hours}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-600">{office.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">Prossimo: {office.nextSlot}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Servizi: {office.services.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-[hsl(210,100%,25%)]">
                    <Calendar className="h-5 w-5 mr-2" />
                    Dettagli Appuntamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Service Type */}
                    <div>
                      <Label htmlFor="serviceType">Tipo di Servizio *</Label>
                      <Select onValueChange={(value) => form.setValue("serviceType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleziona il servizio" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label>Seleziona Data *</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {generateCalendar().map((day) => (
                          <button
                            key={day.date}
                            type="button"
                            className={`p-2 text-xs text-center rounded transition-colors ${
                              selectedDate === day.date
                                ? 'bg-[hsl(210,100%,25%)] text-white'
                                : day.available
                                ? 'border border-gray-300 hover:border-[hsl(210,100%,25%)] hover:bg-blue-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!day.available}
                            onClick={() => {
                              setSelectedDate(day.date);
                              form.setValue("appointmentDate", day.date);
                            }}
                          >
                            <div className="font-medium">{day.dayName}</div>
                            <div>{day.display}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <Label>Orario Disponibile *</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {timeSlots.map((time) => {
                            const isBooked = Math.random() > 0.7; // Random for demo
                            return (
                              <button
                                key={time}
                                type="button"
                                className={`p-2 text-sm rounded border transition-colors ${
                                  form.watch("appointmentTime") === time
                                    ? 'bg-[hsl(210,100%,25%)] text-white border-[hsl(210,100%,25%)]'
                                    : isBooked
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'border-gray-300 hover:border-[hsl(210,100%,25%)] hover:bg-blue-50'
                                }`}
                                disabled={isBooked}
                                onClick={() => form.setValue("appointmentTime", time)}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-[hsl(140,100%,28%)] hover:bg-green-700 text-white"
                      disabled={appointmentMutation.isPending || !selectedOffice || !selectedDate}
                    >
                      {appointmentMutation.isPending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Prenotazione in corso...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Conferma Appuntamento
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Help Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(210,100%,25%)]">Informazioni Utili</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p>Porta sempre con te un documento di identità valido</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p>Presenta ti con 10 minuti di anticipo rispetto all'orario prenotato</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p>Gli accompagnatori possono accedere solo nelle aree pubbliche</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
