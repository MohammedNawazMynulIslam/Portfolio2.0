"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";

import { deleteSkillGroupAction, saveSkillGroupAction } from "@/actions/portfolio";
import { useAsyncAction } from "@/components/admin/useAsyncAction";
import { Button, Field, FormStatus, Input, SubmitButton, Textarea } from "@/components/admin/ui";
import type { SkillGroup } from "@/lib/types";

interface SkillsEditorProps {
  skills: SkillGroup[];
  onUpdated: (skills: SkillGroup[]) => void;
}

export function SkillsEditor({ skills, onUpdated }: SkillsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { pending, message, run } = useAsyncAction();

  const editing = skills.find((group) => group.id === editingId) ?? null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(
      () => saveSkillGroupAction(formData),
      (updated) => {
        onUpdated(updated);
        setEditingId(null);
      },
    );
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this skill group?")) return;
    run(() => deleteSkillGroupAction(id), (updated) => onUpdated(updated), "Deleted");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {skills.length === 0 ? (
          <p className="text-sm text-muted">No skill groups yet. Add one below.</p>
        ) : null}
        {skills.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="font-medium text-foreground">{group.category}</p>
              <p className="text-xs text-muted">
                {group.items.length} skill{group.items.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditingId(group.id)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(group.id)}>
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <form
        key={editingId ?? "new"}
        onSubmit={onSubmit}
        className="space-y-5 rounded-xl border border-border p-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {editing ? "Edit skill group" : "Add skill group"}
        </p>
        <input type="hidden" name="id" defaultValue={editing?.id ?? ""} />
        <Field label="Category">
          <Input name="category" defaultValue={editing?.category ?? ""} required />
        </Field>
        <Field label="Skills" hint="One skill per line">
          <Textarea
            name="items"
            defaultValue={editing?.items.join("\n") ?? ""}
            placeholder={"TypeScript\nReact\nNext.js"}
          />
        </Field>
        {message ? <FormStatus ok={message.ok} message={message.text} /> : null}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
          <SubmitButton pending={pending}>
            {editing ? "Update group" : "Add group"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
