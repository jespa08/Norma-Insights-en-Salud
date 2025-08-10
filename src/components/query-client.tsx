'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createReport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Loader2, Download, CheckCircle2, FileText } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success';

const FormSchema = z.object({
  query: z.string().min(20, { message: "Please provide a more detailed query (minimum 20 characters)." }).max(1000, { message: "Query is too long (maximum 1000 characters)." }),
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
        title: 'Daily Limit Reached',
        description: `You have reached the limit of ${MAX_QUERIES_PER_DAY} queries per day. Please try again tomorrow.`,
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
          title: "Report Generated Successfully!",
          description: "Your report is ready for download.",
        });
      } else {
        setStatus('idle');
        toast({
          variant: "destructive",
          title: "Report Generation Failed",
          description: result.error || "Please check your query and try again.",
        });
      }
    });
  };

  const downloadPdf = () => {
    if (!reportData) return;
    const linkSource = `data:application/pdf;base64,${reportData}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = "Norma_Insights_Report.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
          <CardTitle className="font-headline text-2xl">Generating Your Report</CardTitle>
          <CardDescription>Our AI is analyzing your query and compiling insights. This may take a moment.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Please do not close this window.</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Your Report is Ready!</CardTitle>
          <CardDescription>The comprehensive report for your query has been generated.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
          <CheckCircle2 className="h-16 w-16 text-accent" />
          <Button onClick={downloadPdf} size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download PDF Report
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={resetForm}>Create Another Report</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Submit Your Query</CardTitle>
        <CardDescription>
          Ask a complex question about the healthcare system in Colombia or Mexico. Our AI will generate a detailed, consulting-style report.
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
                  <FormLabel>Your Complex Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Analyze the financial impact of recent telehealth regulations on private clinics in Bogotá and compare them with the framework in Mexico City...'"
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
              Queries today: {dailyCount}/{MAX_QUERIES_PER_DAY}
            </p>
            <Button type="submit" disabled={isPending || isLimitReached}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" /> }
              {isPending ? 'Generating...' : 'Generate Report'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
