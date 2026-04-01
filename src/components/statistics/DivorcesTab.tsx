import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DbFamilyMember } from "@/hooks/useFamilyMembers";
import { FamilyRelationship } from "@/hooks/useRelationships";
import { StatCard } from "./StatCard";

interface Props {
  members: DbFamilyMember[];
  relationships: FamilyRelationship[];
}

export const DivorcesTab = ({ members, relationships }: Props) => {
  const stats = useMemo(() => {
    // Check relationship field for divorce indicators
    const divorcedMembers = members.filter(m =>
      (m.relationship || "").toLowerCase().includes("divorce")
    );
    const totalDivorced = divorcedMembers.length;
    const maleDivorced = divorcedMembers.filter(m => m.gender === "male").length;
    const femaleDivorced = divorcedMembers.filter(m => m.gender === "female").length;

    const marriedCount = relationships.filter(r => r.relationship_type === "spouse").length;
    const divorceRate = marriedCount > 0 ? ((totalDivorced / (marriedCount / 2)) * 100).toFixed(1) : "0";

    return { totalDivorced, maleDivorced, femaleDivorced, divorceRate };
  }, [members, relationships]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Divorced" value={stats.totalDivorced} />
        <StatCard title="Male" value={stats.maleDivorced} />
        <StatCard title="Female" value={stats.femaleDivorced} />
        <StatCard title="Divorce Rate" value={`${stats.divorceRate}%`} subtitle="of marriages" />
      </div>

      {stats.totalDivorced === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No divorce records found in the family data.</p>
            <p className="text-xs text-muted-foreground mt-2">Divorce data is derived from member relationship status fields.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
