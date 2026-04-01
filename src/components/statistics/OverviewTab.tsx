import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenderStats, LivingStats, RelationshipStatusStats } from "@/hooks/useFamilyStatistics";
import { Users, Heart, HeartPulse } from "lucide-react";
import { StatCard } from "./StatCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = [
  "hsl(210, 70%, 50%)", "hsl(340, 65%, 50%)", "hsl(145, 50%, 45%)",
  "hsl(42, 85%, 55%)", "hsl(270, 50%, 55%)", "hsl(20, 70%, 50%)",
];

interface Props {
  gender: GenderStats;
  living: LivingStats;
  relationshipStatus: RelationshipStatusStats;
}

export const OverviewTab = ({ gender, living, relationshipStatus }: Props) => {
  const genderData = [
    { name: "Male", value: gender.male },
    { name: "Female", value: gender.female },
  ];
  const livingData = [
    { name: "Living", value: living.living },
    { name: "Deceased", value: living.deceased },
  ];
  const statusData = [
    { name: "Married", value: relationshipStatus.married },
    { name: "Single", value: relationshipStatus.single },
    { name: "Widowed", value: relationshipStatus.widowed },
    { name: "Divorced", value: relationshipStatus.divorced },
    ...(relationshipStatus.other > 0 ? [{ name: "Other", value: relationshipStatus.other }] : []),
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={gender.total} icon={Users} />
        <StatCard title="Male" value={gender.male} subtitle={`${gender.malePercent}%`} />
        <StatCard title="Female" value={gender.female} subtitle={`${gender.femalePercent}%`} />
        <StatCard title="Living" value={living.living} icon={HeartPulse} subtitle={`${living.livingPercent}%`} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Gender Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genderData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Living vs Deceased</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={livingData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {livingData.map((_, i) => <Cell key={i} fill={COLORS[i + 2]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Relationship Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
