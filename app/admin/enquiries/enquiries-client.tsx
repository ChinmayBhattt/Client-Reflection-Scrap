"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Check, Phone, Clock, CheckCircle2 } from "lucide-react";
import { Enquiry } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toggleEnquiryStatus } from "./actions";

interface EnquiriesClientProps {
  enquiries: Enquiry[];
}

export function EnquiriesClient({ enquiries }: EnquiriesClientProps) {
  const router = useRouter();

  const handleToggle = async (id: string, field: "is_read" | "is_replied", current: boolean) => {
    const res = await toggleEnquiryStatus(id, field, !current);
    if (res.success) {
      toast.success(`Enquiry marked as ${!current ? field.replace("is_", "") : "un-" + field.replace("is_", "")}`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update enquiry.");
    }
  };

  return (
    <div className="space-y-4">
      {enquiries.length > 0 ? (
        enquiries.map((enq) => (
          <Card
            key={enq.id}
            className={`rounded-2xl border transition-all ${
              !enq.is_read
                ? "border-sky-500/50 bg-slate-900 shadow-card"
                : "border-slate-800 bg-slate-950/70"
            }`}
          >
            <CardContent className="p-5 sm:p-6 space-y-4 text-xs text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center font-bold text-sm">
                    {enq.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{enq.name}</h3>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-0.5">
                      <a href={`tel:${enq.phone}`} className="hover:text-sky-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {enq.phone}
                      </a>
                      {enq.email && (
                        <span>• {enq.email}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={enq.is_read ? "outline" : "blue"} className="text-[10px]">
                    {enq.is_read ? "Read" : "Unread"}
                  </Badge>
                  {enq.is_replied && (
                    <Badge variant="success" className="text-[10px]">
                      Replied
                    </Badge>
                  )}
                  <span className="text-slate-500 text-[11px] ml-2">
                    {formatDate(enq.created_at)}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                {enq.message}
              </p>

              {/* Action Toggles */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggle(enq.id, "is_read", enq.is_read)}
                  className="h-7 text-[11px] border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  {enq.is_read ? "Mark as Unread" : "Mark as Read"}
                </Button>

                <Button
                  size="sm"
                  variant={enq.is_replied ? "outline" : "default"}
                  onClick={() => handleToggle(enq.id, "is_replied", enq.is_replied)}
                  className="h-7 text-[11px]"
                >
                  {enq.is_replied ? "Mark Unreplied" : "Mark as Replied"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center text-slate-500 text-xs">
          No customer contact form enquiries received yet.
        </Card>
      )}
    </div>
  );
}

