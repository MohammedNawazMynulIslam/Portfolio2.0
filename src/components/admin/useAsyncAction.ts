"use client";

import { useState, useTransition } from "react";

interface Status {
  ok: boolean;
  text: string;
}

export function useAsyncAction() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<Status | null>(null);

  function run<T>(
    action: () => Promise<T>,
    onSuccess?: (result: T) => void,
    successText = "Saved successfully",
  ) {
    startTransition(async () => {
      try {
        const result = await action();
        setMessage({ ok: true, text: successText });
        onSuccess?.(result);
      } catch (error) {
        setMessage({
          ok: false,
          text: error instanceof Error ? error.message : "Something went wrong",
        });
      }
    });
  }

  return { pending, message, run };
}
