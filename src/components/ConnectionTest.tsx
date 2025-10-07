import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function ConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing connection...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('Testing Supabase connection...');
        console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

        // Test 1: Simple query
        const { data, error, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: false })
          .limit(1);

        if (error) {
          console.error('Supabase error:', error);
          setStatus('error');
          setMessage(`Database Error: ${error.message}`);
          setDetails(error);
          return;
        }

        console.log('Query successful:', { data, count });
        setStatus('success');
        setMessage(`✅ Connected! Found ${count || 0} profiles in database`);
        setDetails({ data, count });

      } catch (err) {
        console.error('Connection test failed:', err);
        setStatus('error');
        setMessage(`Connection Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setDetails(err);
      }
    }

    testConnection();
  }, []);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'testing' && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
          Database Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-500' : 'text-muted-foreground'}`}>
          {message}
        </p>
        {details && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold">Technical Details</summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(details, null, 2)}
            </pre>
          </details>
        )}
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p><strong>Key:</strong> {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
