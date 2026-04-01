import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelationshipNetworkStats } from "@/hooks/useFamilyStatistics";
import { StatCard } from "./StatCard";
import { Link2, GitBranch, Network } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  stats: RelationshipNetworkStats;
}

export const RelationshipsTab = ({ stats }: Props) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Total Connections" value={stats.totalConnections} icon={Link2} />
      <StatCard title="Avg per Person" value={stats.avgConnectionsPerPerson} icon={Network} />
      <StatCard title="Generations" value={stats.treeDepth} icon={GitBranch} />
      <StatCard title="Relationship Types" value={stats.typeDistribution.length} />
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Most Connected Members</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.mostConnected.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="font-medium text-foreground">{m.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{m.count} connections</span>
              </div>
            ))}
            {stats.mostConnected.length === 0 && <p className="text-muted-foreground text-sm">No relationship data available</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Relationship Type Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.typeDistribution.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);
