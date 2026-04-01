import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChildrenStats } from "@/hooks/useFamilyStatistics";
import { StatCard } from "./StatCard";
import { Baby } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  stats: ChildrenStats;
}

export const ChildrenTab = ({ stats }: Props) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard title="Avg Children/Parent" value={stats.avgChildrenPerFamily} icon={Baby} />
      <StatCard title="Most Children" value={stats.familyWithMostChildren?.count ?? "N/A"} subtitle={stats.familyWithMostChildren?.parents} />
      <StatCard title="Childless Married" value={stats.childlessMarried} />
    </div>

    <Card>
      <CardHeader><CardTitle className="text-lg">Family Size Distribution</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.familySizeDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="size" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-lg">People with Most Children</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.peopleWithMostChildren.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div>
                  <span className="font-medium text-foreground">{p.name}</span>
                  <p className="text-xs text-muted-foreground capitalize">{p.gender}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">{p.count} children</span>
            </div>
          ))}
          {stats.peopleWithMostChildren.length === 0 && <p className="text-muted-foreground text-sm">No data available</p>}
        </div>
      </CardContent>
    </Card>
  </div>
);
