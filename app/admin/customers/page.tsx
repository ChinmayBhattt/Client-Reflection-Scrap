import type { Metadata } from "next";
import { getCustomersAdmin } from "@/lib/services/admin";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Registered Customers - Admin",
};

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await getCustomersAdmin();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white">
          Registered Customer Accounts
        </h1>
        <p className="text-xs text-slate-400">
          Read-only directory of customer profiles and total booking volumes.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-subtle">
        <Table>
          <TableHeader className="bg-slate-900/80">
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400 font-bold text-xs">Full Name</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Contact Phone</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Role</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs text-center">Total Pickups</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs text-right">Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <TableRow key={c.id} className="border-slate-800/80 hover:bg-slate-900/50">
                  <TableCell className="font-bold text-xs text-white">
                    {c.full_name || "Anonymous User"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {c.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.role === "admin" ? "warning" : "blue"} className="text-[10px] capitalize">
                      {c.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold text-xs text-white">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono">
                      {c.pickups_count}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-500">
                    {formatDate(c.created_at)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                  No registered customer profiles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

