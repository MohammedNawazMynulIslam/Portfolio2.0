"use client";

import { updateAboutAction } from "@/actions/portfolio";
import { useAsyncAction } from "@/components/admin/useAsyncAction";
import {
  Field,
  FormStatus,
  SubmitButton,
  Textarea,
} from "@/components/admin/ui";
import type { About } from "@/lib/types";

interface AboutEditorProps {
  about: About;
  onUpdated: (about: About) => void;
}

export function AboutEditor({ about, onUpdated }: AboutEditorProps) {
  const { pending, message, run } = useAsyncAction();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(() => updateAboutAction(formData), (updated) => onUpdated(updated));
  }

  const statsText = about.stats
    .map((stat) => `${stat.value}|${stat.label}`)
    .join("\n");

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Current status">
        <Textarea name="currentStatus" defaultValue={about.currentStatus} />
      </Field>

      <Field label="Bio">
        <Textarea name="bio" defaultValue={about.bio} className="min-h-32" />
      </Field>

      <Field label="Future goal">
        <Textarea name="futureGoal" defaultValue={about.futureGoal} />
      </Field>

      <Field
        label="Stats"
        hint="One stat per line, in the format: value|label (e.g. 5+|Years Experience)"
      >
        <Textarea name="stats" defaultValue={statsText} />
      </Field>

      {message ? <FormStatus ok={message.ok} message={message.text} /> : null}

      <div className="flex justify-end">
        <SubmitButton pending={pending}>Save about</SubmitButton>
      </div>
    </form>
  );
}
