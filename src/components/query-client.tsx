'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createReport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Loader2, Download, CheckCircle2, FileText } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success';

const FormSchema = z.object({
  query: z.string().min(20, { message: "Por favor, proporcione una consulta más detallada (mínimo 20 caracteres)." }).max(1000, { message: "La consulta es demasiado larga (máximo 1000 caracteres)." }),
});

const MAX_QUERIES_PER_DAY = 2;

export function QueryClient() {
  const [status, setStatus] = useState<Status>('idle');
  const [reportData, setReportData] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [dailyCount, setDailyCount] = useState(0);
  
  const { toast } = useToast();

  useEffect(() => {
    const usageData = localStorage.getItem('normaInsightsUsage');
    if (usageData) {
      try {
        const { date, count } = JSON.parse(usageData);
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
          setDailyCount(count);
        } else {
          localStorage.removeItem('normaInsightsUsage');
        }
      } catch (error) {
        localStorage.removeItem('normaInsightsUsage');
      }
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { query: '' },
  });

  const handleUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem('normaInsightsUsage', JSON.stringify({ date: today, count: newCount }));
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (dailyCount >= MAX_QUERIES_PER_DAY) {
      toast({
        variant: 'destructive',
        title: 'Límite diario alcanzado',
        description: `Ha alcanzado el límite de ${MAX_QUERIES_PER_DAY} consultas por día. Por favor, inténtelo de nuevo mañana.`,
      });
      return;
    }

    startTransition(async () => {
      setStatus('loading');
      setProgress(10);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 5;
        });
      }, 800);

      const result = await createReport(data.query);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data?.report) {
        setReportData(result.data.report);
        setStatus('success');
        handleUsage();
        toast({
          title: "¡Informe generado con éxito!",
          description: "Su informe está listo para descargar.",
        });
      } else {
        setStatus('idle');
        toast({
          variant: "destructive",
          title: "Falló la generación del informe",
          description: result.error || "Por favor, revise su consulta e intente de nuevo.",
        });
      }
    });
  };

  const downloadReport = () => {
    if (!reportData) return;
  
    const doc = new jsPDF();
    
    // Add custom font if needed, though default Helvetica is fine
    // doc.addFont('Literata-Regular.ttf', 'Literata', 'normal');
    // doc.setFont('Literata');
  
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
  
    doc.setFontSize(18);
    doc.text("Reporte de Norma Insights", pageWidth / 2, margin, { align: 'center' });
  
    doc.setFontSize(12);
    // Split text into lines that fit the page width
    const textLines = doc.splitTextToSize(reportData, usableWidth);
    
    let cursorY = margin + 20; // Start below the title
  
    textLines.forEach((line: string) => {
      if (cursorY > usableHeight) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 7; // Line height
    });
  
    doc.save("Norma_Insights_Reporte.pdf");
  };
  
  const resetForm = () => {
    setStatus('idle');
    setReportData(null);
    setProgress(0);
    form.reset();
  }

  const isLimitReached = dailyCount >= MAX_QUERIES_PER_DAY;

  if (status === 'loading') {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Generando su informe</CardTitle>
          <CardDescription>Nuestra IA está analizando su consulta y recopilando información. Esto puede tardar un momento.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Por favor, no cierre esta ventana.</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">¡Su informe está listo!</CardTitle>
          <CardDescription>El informe completo para su consulta ha sido generado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
          <CheckCircle2 className="h-16 w-16 text-accent" />
          <Button onClick={downloadReport} size="lg">
            <Download className="mr-2 h-5 w-5" />
            Descargar Informe PDF
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={resetForm}>Crear otro informe</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Envíe su consulta</CardTitle>
        <CardDescription>
          Haga una pregunta compleja sobre el sistema de salud en Colombia o México. Nuestra IA generará un informe detallado al estilo de consultoría.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Su consulta compleja</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: 'Analizar el impacto financiero de las regulaciones recientes de telesalud en las clínicas privadas de Bogotá y compararlas con el marco de la Ciudad de México...'"
                      className="min-h-[150px] font-body text-base"
                      disabled={isPending || isLimitReached}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/50 p-4 rounded-b-lg">
            <p className="text-sm text-muted-foreground">
              Consultas hoy: {dailyCount}/{MAX_QUERIES_PER_DAY}
            </p>
            <Button type="submit" disabled={isPending || isLimitReached}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" /> }
              {isPending ? 'Generando...' : 'Generar Informe'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
