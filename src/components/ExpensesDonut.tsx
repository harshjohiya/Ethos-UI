import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Operations", value: 183, color: "hsl(var(--chart-1))" },
  { name: "Marketing", value: 142, color: "hsl(var(--chart-2))" },
  { name: "Sales", value: 98, color: "hsl(var(--chart-3))" },
];

export function ExpensesDonut() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Category</CardTitle>
        <p className="text-sm text-muted-foreground">Average spending per category</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-foreground">423</p>
          <p className="text-sm text-muted-foreground">Total Categories</p>
        </div>
      </CardContent>
    </Card>
  );
}
