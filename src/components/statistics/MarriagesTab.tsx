import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbFamilyMember } from "@/hooks/useFamilyMembers";
import { FamilyRelationship } from "@/hooks/useRelationships";
import { StatCard } from "./StatCard";
import { Heart } from "lucide-react";

interface Props {
  members: DbFamilyMember[];
  relationships: FamilyRelationship[];
}

export const MarriagesTab = ({ members, relationships }: Props) => {
  const stats = useMemo(() => {
    const spouseRels = relationships.filter(r => r.relationship_type === "spouse");
    const marriedIds = new Set(spouseRels.map(r => r.member_id));
    const totalMarried = marriedIds.size;

    // Marriage counts per person
    const marriageCounts: Record<string, number> = {};
    spouseRels.forEach(r => {
      marriageCounts[r.member_id] = (marriageCounts[r.member_id] || 0) + 1;
    });

    const once = Object.values(marriageCounts).filter(c => c === 1).length;
    const twice = Object.values(marriageCounts).filter(c => c === 2).length;
    const threeOrMore = Object.values(marriageCounts).filter(c => c >= 3).length;
    const neverMarried = members.length - marriedIds.size;

    const memberMap = Object.fromEntries(members.map(m => [m.id, m]));
    const mostMarried = Object.entries(marriageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => ({ name: memberMap[id]?.name || "Unknown", count }));

    return { totalMarried, totalMarriages: Math.floor(spouseRels.length / 2) || spouseRels.length, once, twice, threeOrMore, neverMarried, mostMarried };
  }, [members, relationships]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="People Married" value={stats.totalMarried} icon={Heart} />
        <StatCard title="Total Marriages" value={stats.totalMarriages} />
        <StatCard title="Never Married" value={stats.neverMarried} />
        <StatCard title="Avg Marriages" value={stats.totalMarried ? (stats.totalMarriages / stats.totalMarried).toFixed(1) : "0"} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Marriage Count Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Married once", value: stats.once },
                { label: "Married twice", value: stats.twice },
                { label: "Married 3+ times", value: stats.threeOrMore },
                { label: "Never married", value: stats.neverMarried },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Most Married Individuals</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.mostMarried.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="font-medium text-foreground">{m.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{m.count} marriage{m.count > 1 ? "s" : ""}</span>
                </div>
              ))}
              {stats.mostMarried.length === 0 && <p className="text-muted-foreground text-sm">No marriage data available</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
