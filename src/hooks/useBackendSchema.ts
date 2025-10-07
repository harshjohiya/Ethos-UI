import { useEffect, useState } from 'react';

export function useBackendSchema() {
  const [schema, setSchema] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/schema');
        if (!mounted) return;
        if (!res.ok) throw new Error(`Backend responded ${res.status}`);
        const json = await res.json();
        setSchema(json as Record<string, any>);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { schema, loading, error };
}
