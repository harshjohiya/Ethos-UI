import { DollarSign, TrendingUp, Users, ShoppingCart } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { ExpensesDonut } from "@/components/ExpensesDonut";
import { TopProducts } from "@/components/TopProducts";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="$67,452"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricCard
          title="Sales Funnel"
          value="489"
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Active Users"
          value="2,845"
          change="-2.4%"
          changeType="negative"
          icon={Users}
        />
        <MetricCard
          title="Orders"
          value="673"
          change="+5.1%"
          changeType="positive"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <AnalyticsChart />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-3">
          <ExpensesDonut />
        </div>
        <div className="lg:col-span-4">
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
