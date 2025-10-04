import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

interface ActivityData {
  time: string;
  activities: number;
  predicted: number;
  regular: number;
}

interface CampusActivityChartProps {
  data: ActivityData[];
}

export function CampusActivityChart({ data }: CampusActivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Campus Activity Trend
        </CardTitle>
        <CardDescription>
          Real-time activity monitoring and ML predictions over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                name === 'regular' ? 'Regular Activities' : 
                name === 'predicted' ? 'ML Predictions' : 'Total'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="regular" 
              stackId="1" 
              stroke="#22c55e" 
              fill="#22c55e" 
              fillOpacity={0.6} 
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stackId="1" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
