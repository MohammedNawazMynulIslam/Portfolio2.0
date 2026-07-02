"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";

import {
  deleteExperienceAction,
  saveExperienceAction,
} from "@/actions/portfolio";
import { useAsyncAction } from "@/components/admin/useAsyncAction";
import {
  Button,
  Checkbox,
  Field,
  FormStatus,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/admin/ui";
import type { ExperienceItem } from "@/lib/types";

interface ExperienceEditorProps {
  experience: ExperienceItem[];
  onUpdated: (experience: ExperienceItem[]) => void;
}

export function ExperienceEditor({ experience, onUpdated }: ExperienceEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { pending, message, run } = useAsyncAction();

  const editing = experience.find((item) => item.id === editingId) ?? null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(
      () => saveExperienceAction(formData),
      (updated) => {
        onUpdated(updated);
        setEditingId(null);
      },
    );
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this experience entry?")) return;
    run(() => deleteExperienceAction(id), (updated) => onUpdated(updated), "Deleted");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {experience.length === 0 ? (
          <p className="text-sm text-muted">No experience entries yet. Add one below.</p>
        ) : null}
        {experience.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="font-medium text-foreground">
                {item.company}{" "}
                {item.current ? (
                  <span className="ml-2 rounded-full border border-accent/40 bg-accent-dim px-2 py-0.5 font-mono text-[10px] uppercase text-accent">
                    Current
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-muted">
                {item.role} · {item.period}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditingId(item.id)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(item.id)}>
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
          {editing ? "Edit experience" : "Add experience"}
        </p>
        <input type="hidden" name="id" defaultValue={editing?.id ?? ""} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company">
            <Input name="company" defaultValue={editing?.company ?? ""} required />
          </Field>
          <Field label="Role">
            <Input name="role" defaultValue={editing?.role ?? ""} required />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Team">
            <Input name="team" defaultValue={editing?.team ?? ""} />
          </Field>
          <Field label="Period">
            <Input name="period" defaultValue={editing?.period ?? ""} placeholder="2024 - Present" />
          </Field>
        </div>
        <Checkbox
          name="current"
          label="This is my current role"
          defaultChecked={editing?.current ?? false}
        />
        <Field label="Current project" hint="What you're building right now (shown for current roles)">
          <Textarea name="currentProject" defaultValue={editing?.currentProject ?? ""} />
        </Field>
        <Field label="Achievements & solved issues" hint="One per line">
          <Textarea
            name="achievements"
            defaultValue={editing?.achievements.join("\n") ?? ""}
            className="min-h-32"
            placeholder={"Shipped X, improving Y by Z%\nFixed race condition in..."}
          />
        </Field>
        {message ? <FormStatus ok={message.ok} message={message.text} /> : null}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
          <SubmitButton pending={pending}>
            {editing ? "Update entry" : "Add entry"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
