import { useState } from "react";
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
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const candidate = key.trim();
    if (!candidate) return;

    setSaving(true);
    setError(null);
    try {
      const profile = await validateAndSaveApiKey(candidate);
      // Seed the cache so the header shows the account immediately.
      queryClient.setQueryData(queryKeys.profile, profile);
    } catch {
      setError("That API key didn't work. Check it and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
          value={key}
          onChange={(e) => setKey(e.currentTarget.value)}
          placeholder="sk_..."
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
