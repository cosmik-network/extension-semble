import { useActionState, useState } from "react";
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { validateAndSaveApiKey } from "../../../../lib/library";
import { queryKeys } from "../../../../lib/queries/queryKeys";

/**
 * Sign-in form shown when no API key is configured. Validates the key
 * against the profile endpoint and persists it only on success — the
 * popup then re-renders into the normal flow via `useApiKey()`.
 */
export function ApiKeyForm() {
  const queryClient = useQueryClient();
  // Controlled only so the submit button can disable until something is typed.
  const [key, setKey] = useState("");

  const [error, submit, saving] = useActionState<string | null, FormData>(
    async (_prev, formData) => {
      const candidate = String(formData.get("key") ?? "").trim();
      if (!candidate) return null;
      try {
        const profile = await validateAndSaveApiKey(candidate);
        // Seed the cache so the header shows the account immediately.
        queryClient.setQueryData(queryKeys.profile, profile);
        return null;
      } catch {
        return "That API key didn't work. Check it and try again.";
      }
    },
    null,
  );

  return (
    <form action={submit}>
      <Stack gap="sm">
        <Title order={4}>Sign in to Semble</Title>
        <Text size="sm" c="dimmed">
          Paste your API key to connect your library. You can create one at{" "}
          <Anchor
            href="https://semble.so/settings/api-keys"
            target="_blank"
            rel="noreferrer"
            size="sm"
            color="blue"
          >
            semble.so/settings/api-keys
          </Anchor>
          .
        </Text>

        <PasswordInput
          name="key"
          value={key}
          onChange={(e) => setKey(e.currentTarget.value)}
          placeholder="Add your API key"
          aria-label="Semble API key"
          autoFocus
          data-autofocus
        />

        {error && (
          <Alert color="red" variant="light" p="xs">
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          radius={"md"}
          loading={saving}
          disabled={!key.trim()}
        >
          Sign in
        </Button>
      </Stack>
    </form>
  );
}
