import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Euro, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
  estimatedTime: string;
  cost: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  className,
  estimatedTime,
  cost
}: ServiceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-8">
        <div className="flex items-start space-x-4">
          <div className={cn("text-white p-3 rounded-lg", className)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-4 text-sm">{description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Tempo stimato:
                </span>
                <Badge variant="secondary">{estimatedTime}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500">
                  <Euro className="h-4 w-4 mr-1" />
                  Costo:
                </span>
                <Badge variant="secondary">{cost}</Badge>
              </div>
            </div>
            
            <Link href={href}>
              <Button className={cn("w-full text-white hover:opacity-90", className)}>
                Inizia procedura
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
