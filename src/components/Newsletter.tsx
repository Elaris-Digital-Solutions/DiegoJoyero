import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Recibirás nuestras últimas colecciones en tu correo.",
      });
      setEmail("");
    }
  };

  return (
    <Card className="p-6 shadow-elegant bg-gradient-dark border-gold/20">
      <div className="text-center mb-4">
        <Mail className="h-8 w-8 text-gold mx-auto mb-3" />
        <h3 className="font-playfair text-xl text-pearl mb-2">Newsletter Exclusivo</h3>
        <p className="text-pearl/70 text-sm">
          Recibe nuestras últimas colecciones y ofertas especiales
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/10 border-gold/30 text-pearl placeholder:text-pearl/50 focus-visible:ring-gold"
          required
        />
        <Button type="submit" variant="luxury" className="w-full">
          Suscribirse
        </Button>
      </form>
    </Card>
  );
};
