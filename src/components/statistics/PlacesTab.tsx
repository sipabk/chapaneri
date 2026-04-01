import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  stats: {
    birthPlaces: { place: string; count: number }[];
    deathPlaces: { place: string; count: number }[];
    residences: { place: string; count: number }[];
  };
}

const PlaceChart = ({ data, title }: { data: { place: string; count: number }[]; title: string }) => (
  <Card>
    <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={Math.max(200, data.slice(0, 10).length * 35)}>
          <BarChart data={data.slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="place" type="category" width={150} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted-foreground text-sm py-8 text-center">No data available</p>
      )}
    </CardContent>
  </Card>
);

export const PlacesTab = ({ stats }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2 text-muted-foreground">
      <MapPin className="w-5 h-5" />
      <span className="text-sm">Geographic distribution of family members</span>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <PlaceChart data={stats.birthPlaces} title="Birth Locations" />
      <PlaceChart data={stats.deathPlaces} title="Death Locations" />
    </div>
    <PlaceChart data={stats.residences} title="Residences" />
  </div>
);
