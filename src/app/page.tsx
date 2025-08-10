import { Header } from "@/components/header";
import { QueryClient } from "@/components/query-client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
            Inteligencia Regulatoria de Salud Impulsada por IA
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Obtenga un análisis instantáneo y profundo del complejo panorama de la salud en Colombia y México. Simplemente haga su pregunta y reciba un informe profesional basado en datos.
          </p>
        </div>

        <div className="mt-8 md:mt-12">
          <QueryClient />
        </div>
      </main>
      <footer className="py-6 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Norma Insights. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
