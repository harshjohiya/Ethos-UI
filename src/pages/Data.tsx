import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { useBackendSchema } from "@/hooks/useBackendSchema";

const ENV_TABLE = import.meta.env.VITE_SUPABASE_TABLE as string | undefined;

export default function DataPage() {
  const [tableName, setTableName] = useState<string>("");
  const [activeTable, setActiveTable] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("supabase_table");
    const initial = ENV_TABLE || saved || "";
    setTableName(initial);
    setActiveTable(initial);
  }, []);

  const { data, isLoading, error } = useSupabaseTable<any>({
    table: activeTable || "__invalid__",
    select: "*",
    limit: 100,
  });

    const { schema, loading: schemaLoading, error: schemaError } = useBackendSchema();

  const columns = useMemo(() => (data && data.length > 0 ? Object.keys(data[0]) : []), [data]);

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Enter table name (e.g., users)"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
            <Button
              onClick={() => {
                setActiveTable(tableName.trim());
                if (tableName.trim()) localStorage.setItem("supabase_table", tableName.trim());
              }}
              disabled={!tableName.trim()}
            >
              Load
            </Button>
          </div>
          {!activeTable && (
            <p className="text-sm text-muted-foreground">Set VITE_SUPABASE_TABLE in .env or enter a table name above.</p>
          )}
        </CardContent>
      </Card>

      {activeTable && (
        <Card>
          <CardHeader>
            <CardTitle>{activeTable} (first 100 rows)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {error && <p className="text-sm text-red-600">{(error as Error).message}</p>}
            {/* If Supabase had no data and backend schema is available, show backend sample */}
            {!isLoading && !error && (!data || data.length === 0) && schema && schema[activeTable] && (
              <div>
                <p className="text-sm text-muted-foreground">Showing backend sample rows for {activeTable}</p>
                <pre className="text-xs bg-slate-100 p-2 rounded">{JSON.stringify(schema[activeTable].sample, null, 2)}</pre>
              </div>
            )}
            {!isLoading && !error && (!data || data.length === 0) && !schema && schemaLoading && (
              <p className="text-sm text-muted-foreground">Loading backend schema…</p>
            )}
            {!isLoading && !error && (!data || data.length === 0) && schemaError && (
              <p className="text-sm text-red-600">Backend schema error: {schemaError.message}</p>
            )}
            {!isLoading && !error && data && data.length > 0 && (
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((row, idx) => (
                      <TableRow key={idx}>
                        {columns.map((col) => (
                          <TableCell key={col}>
                            {typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


