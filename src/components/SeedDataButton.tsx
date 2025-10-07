import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedDatabase } from '@/scripts/seedData';
import { Database, Loader2 } from 'lucide-react';

export function SeedDataButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('Seeding database...');
    
    try {
      const result = await seedDatabase();
      
      if (result.success) {
        setMessage('✅ Database seeded successfully! Refresh the page to see data.');
      } else {
        setMessage('❌ Error seeding database. Check console for details.');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5" />
        <h3 className="font-semibold">Database Setup</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        No data found? Click below to populate your database with sample data.
      </p>
      <Button 
        onClick={handleSeed} 
        disabled={loading}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Seeding Database...' : 'Seed Sample Data'}
      </Button>
      {message && (
        <p className="text-sm mt-2 p-2 rounded bg-muted">
          {message}
        </p>
      )}
    </div>
  );
}
