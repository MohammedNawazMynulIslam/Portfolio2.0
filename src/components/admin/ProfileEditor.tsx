"use client";

import { updateProfileAction } from "@/actions/portfolio";
import { useAsyncAction } from "@/components/admin/useAsyncAction";
import {
  Field,
  FormStatus,
  Input,
  SubmitButton,
  Textarea,
} from "@/components/admin/ui";
import type { Profile } from "@/lib/types";

interface ProfileEditorProps {
  profile: Profile;
  onUpdated: (profile: Profile) => void;
}

export function ProfileEditor({ profile, onUpdated }: ProfileEditorProps) {
  const { pending, message, run } = useAsyncAction();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(
      () => updateProfileAction(formData),
      (updated) => onUpdated(updated),
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={profile.name} required />
        </Field>
        <Field label="Role">
          <Input name="role" defaultValue={profile.role} required />
        </Field>
      </div>

      <Field label="Tagline">
        <Textarea name="tagline" defaultValue={profile.tagline} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Hero image URL">
          <Input name="heroImage" defaultValue={profile.heroImage} />
        </Field>
        <Field label="Resume URL">
          <Input name="resumeUrl" defaultValue={profile.resumeUrl} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location">
          <Input name="location" defaultValue={profile.location} />
        </Field>
        <Field label="Availability">
          <Input name="availability" defaultValue={profile.availability} />
        </Field>
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Social links
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email">
            <Input name="social.email" defaultValue={profile.social.email} />
          </Field>
          <Field label="GitHub">
            <Input name="social.github" defaultValue={profile.social.github} />
          </Field>
          <Field label="LinkedIn">
            <Input name="social.linkedin" defaultValue={profile.social.linkedin} />
          </Field>
          <Field label="X / Twitter">
            <Input name="social.twitter" defaultValue={profile.social.twitter ?? ""} />
          </Field>
        </div>
      </div>

      {message ? <FormStatus ok={message.ok} message={message.text} /> : null}

      <div className="flex justify-end">
        <SubmitButton pending={pending}>Save profile</SubmitButton>
      </div>
    </form>
  );
}
