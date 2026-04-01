import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BirthMonthStat, ZodiacStat, DecadeStat } from "@/hooks/useFamilyStatistics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ZODIAC_COLORS = [
  "hsl(0,65%,50%)", "hsl(30,70%,50%)", "hsl(60,65%,45%)", "hsl(90,55%,45%)",
  "hsl(120,50%,45%)", "hsl(150,55%,45%)", "hsl(180,55%,45%)", "hsl(210,65%,50%)",
  "hsl(240,55%,55%)", "hsl(270,50%,50%)", "hsl(300,50%,50%)", "hsl(330,60%,50%)",
];

interface Props {
  months: BirthMonthStat[];
  zodiac: ZodiacStat[];
  decades: DecadeStat[];
}

export const BirthsTab = ({ months, zodiac, decades }: Props) => (
  <div className="space-y-6">
    <Card>
      <CardHeader><CardTitle className="text-lg">Births by Month</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={months}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Zodiac Sign Distribution</CardTitle></CardHeader>
        <CardContent>
          {zodiac.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={zodiac} dataKey="count" nameKey="sign" cx="50%" cy="50%" outerRadius={100} label={({ sign, percent }) => `${sign} ${(percent * 100).toFixed(0)}%`}>
                  {zodiac.map((_, i) => <Cell key={i} fill={ZODIAC_COLORS[i % ZODIAC_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">No birth date data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Births by Decade</CardTitle></CardHeader>
        <CardContent>
          {decades.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={decades}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="decade" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(42, 85%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">No birth date data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
