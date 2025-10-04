import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const products = [
  { id: "#8521926", date: "Jan 24th, 2024", status: "Delivered", amount: "$285" },
  { id: "#8521858", date: "Jan 23rd, 2024", status: "Pending", amount: "$145" },
  { id: "#8147424", date: "Jan 20th, 2024", status: "Delivered", amount: "$520" },
  { id: "#8147365", date: "Jan 18th, 2024", status: "Cancelled", amount: "$365" },
];

const statusColors = {
  Delivered: "success",
  Pending: "warning",
  Cancelled: "destructive",
} as const;

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <p className="text-sm text-muted-foreground">Recent orders and status</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="font-medium text-foreground">{product.id}</p>
                <p className="text-sm text-muted-foreground">{product.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={statusColors[product.status as keyof typeof statusColors] as any}
                  className="min-w-[90px] justify-center"
                >
                  {product.status}
                </Badge>
                <p className="min-w-[60px] text-right font-semibold text-foreground">
                  {product.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
