"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";

import { deleteProjectAction, saveProjectAction } from "@/actions/portfolio";
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
import type { Project } from "@/lib/types";

interface ProjectsEditorProps {
  projects: Project[];
  onUpdated: (projects: Project[]) => void;
}

export function ProjectsEditor({ projects, onUpdated }: ProjectsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { pending, message, run } = useAsyncAction();

  const editing = projects.find((project) => project.id === editingId) ?? null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(
      () => saveProjectAction(formData),
      (updated) => {
        onUpdated(updated);
        setEditingId(null);
      },
    );
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this project?")) return;
    run(() => deleteProjectAction(id), (updated) => onUpdated(updated), "Deleted");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted">No projects yet. Add one below.</p>
        ) : null}
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="font-medium text-foreground">
                {project.name}{" "}
                {project.featured ? (
                  <span className="ml-2 rounded-full border border-accent/40 bg-accent-dim px-2 py-0.5 font-mono text-[10px] uppercase text-accent">
                    Featured
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-muted">{project.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditingId(project.id)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(project.id)}>
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
          {editing ? "Edit project" : "Add project"}
        </p>
        <input type="hidden" name="id" defaultValue={editing?.id ?? ""} />
        <Field label="Name">
          <Input name="name" defaultValue={editing?.name ?? ""} required />
        </Field>
        <Field label="Short description">
          <Input name="description" defaultValue={editing?.description ?? ""} required />
        </Field>
        <Field label="Details">
          <Textarea name="details" defaultValue={editing?.details ?? ""} />
        </Field>
        <Field label="Tech stack" hint="One technology per line">
          <Textarea
            name="techStack"
            defaultValue={editing?.techStack.join("\n") ?? ""}
            placeholder={"Next.js\nTypeScript\nTailwind CSS"}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Live URL">
            <Input name="liveUrl" defaultValue={editing?.liveUrl ?? ""} />
          </Field>
          <Field label="GitHub URL">
            <Input name="githubUrl" defaultValue={editing?.githubUrl ?? ""} />
          </Field>
        </div>
        <Field label="Image URL">
          <Input name="image" defaultValue={editing?.image ?? ""} />
        </Field>
        <Checkbox
          name="featured"
          label="Feature this project on the homepage"
          defaultChecked={editing?.featured ?? false}
        />
        {message ? <FormStatus ok={message.ok} message={message.text} /> : null}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
          <SubmitButton pending={pending}>
            {editing ? "Update project" : "Add project"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
