import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, History } from "lucide-react";
import { useActivityLog, ActivityLog } from "@/hooks/useActivityLog";

const actionBadge = (type: string) => {
  switch (type) {
    case "create": return <Badge className="bg-green-600 text-white">Created</Badge>;
    case "update": return <Badge variant="secondary">Updated</Badge>;
    case "delete": return <Badge variant="destructive">Deleted</Badge>;
    default: return <Badge variant="outline">{type}</Badge>;
  }
};

export const ActivityLogPanel = () => {
  const { fetchLogs } = useActivityLog();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchLogs();
      setLogs(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = logs.filter(log => {
    const matchesAction = filterAction === "all" || log.action_type === filterAction;
    const matchesSearch = searchQuery === "" ||
      log.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performed_by_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Activity Log ({filtered.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Search by member or user..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Created</SelectItem>
              <SelectItem value="update">Updated</SelectItem>
              <SelectItem value="delete">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activity logs found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{actionBadge(log.action_type)}</TableCell>
                    <TableCell className="font-medium">{log.entity_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.performed_by_email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {log.changes && Object.keys(log.changes).length > 0
                        ? Object.keys(log.changes).join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
