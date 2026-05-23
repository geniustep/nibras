"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admission/ui/Button";
import { Textarea } from "@/components/admission/ui/Textarea";
import { formatDateTime } from "@/lib/admission/format";

type Note = {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string };
  visibility: string;
};

export function AdmissionNotesPanel({
  requestId,
  initialNotes,
  canAdd,
}: {
  requestId: string;
  initialNotes: Note[];
  canAdd: boolean;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/admissions/${requestId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "تعذر الإضافة");
        return;
      }
      setNotes([data.note, ...notes]);
      setContent("");
      router.refresh();
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <>
          <Textarea
            label="ملاحظة داخلية جديدة"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={error}
            placeholder="للطاقم الإداري فقط — لا تظهر لولي الأمر"
          />
          <Button onClick={handleAdd} loading={loading} variant="secondary">
            إضافة ملاحظة
          </Button>
        </>
      )}
      {!canAdd && (
        <p className="text-sm text-slate-500">عرض الملاحظات فقط (بدون إضافة).</p>
      )}
      <ul className="space-y-3">
        {notes.length === 0 && (
          <li className="text-sm text-slate-500">لا توجد ملاحظات بعد.</li>
        )}
        {notes.map((note) => (
          <li
            key={note.id}
            className="rounded-xl border border-slate-100 bg-[#F5F8FF] p-4"
          >
            <p className="text-sm text-[#0E2250]">{note.content}</p>
            <p className="mt-2 text-xs text-slate-500">
              {note.author.name} — {formatDateTime(note.createdAt)}
              {note.visibility === "INTERNAL" && " · داخلية فقط"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
