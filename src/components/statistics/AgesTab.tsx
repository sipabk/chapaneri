import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgeGroup, PersonAge } from "@/hooks/useFamilyStatistics";
import { StatCard } from "./StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  ageGroups: AgeGroup[];
  oldest: PersonAge[];
  youngest: PersonAge[];
}

const PersonList = ({ people, title }: { people: PersonAge[]; title: string }) => (
  <Card>
    <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
    <CardContent>
      <div className="space-y-3">
        {people.map((p, i) => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <div>
                <span className="font-medium text-foreground">{p.name}</span>
                <p className="text-xs text-muted-foreground">Born {p.birthYear}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground">{p.age} yrs</span>
          </div>
        ))}
        {people.length === 0 && <p className="text-muted-foreground text-sm">No data available</p>}
      </div>
    </CardContent>
  </Card>
);

export const AgesTab = ({ ageGroups, oldest, youngest }: Props) => {
  const withData = ageGroups.filter(g => g.total > 0);
  const avgAge = withData.length > 0
    ? Math.round(ageGroups.reduce((s, g) => {
        const mid = g.range === "90+" ? 95 : parseInt(g.range) + 5;
        return s + mid * g.total;
      }, 0) / ageGroups.reduce((s, g) => s + g.total, 0))
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Avg Age" value={avgAge} subtitle="years" />
        <StatCard title="Oldest Living" value={oldest[0]?.age ?? "N/A"} subtitle={oldest[0]?.name} />
        <StatCard title="Youngest" value={youngest[0]?.age ?? "N/A"} subtitle={youngest[0]?.name} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Age Distribution by Gender</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ageGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" name="Male" fill="hsl(210, 70%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" name="Female" fill="hsl(340, 65%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <PersonList people={oldest} title="Oldest Living Members" />
        <PersonList people={youngest} title="Youngest Members" />
      </div>
    </div>
  );
};
