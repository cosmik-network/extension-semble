import { useActionState, useState } from "react";
import {
  Alert,
  Anchor,
  Avatar,
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useApiKey } from "../../lib/hooks";
import { validateAndSaveApiKey } from "../../lib/library";
import { useMyProfile } from "../../lib/queries";
import { queryKeys } from "../../lib/queries/queryKeys";
import { clearApiKey } from "../../lib/semble";

/** Extension settings page: view, set/replace, and clear the API key. */
function App() {
  const apiKey = useApiKey();

  return (
    <Center mih="100vh" p="md">
      <Card w={480} withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Title order={3}>Semble Settings</Title>
          {apiKey ? <ConfiguredView apiKey={apiKey} /> : <SetupView />}
        </Stack>
      </Card>
    </Center>
  );
}

/** No key yet: explain where to get one and offer the entry form. */
function SetupView() {
  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        Connect your Semble account by pasting an API key. You can create one
        at{" "}
        <Anchor
          href="https://semble.so/settings/api-keys"
          target="_blank"
          rel="noreferrer"
          size="sm"
        >
          semble.so/settings/api-keys
        </Anchor>
        .
      </Text>
      <KeyForm submitLabel="Save key" />
    </Stack>
  );
}

/** Key configured: connected account, masked key, replace and clear. */
function ConfiguredView(props: { apiKey: string }) {
  const queryClient = useQueryClient();
  const profile = useMyProfile();
  const [replacing, setReplacing] = useState(false);

  async function handleClear() {
    await clearApiKey();
    queryClient.clear();
  }

  return (
    <Stack gap="sm">
      {profile.data ? (
        <Group gap="xs" wrap="nowrap">
          <Avatar
            src={profile.data.avatarUrl}
            name={profile.data.name}
            size={32}
            radius="sm"
          />
          <Stack gap={0}>
            <Text fw={600} size="sm" lineClamp={1}>
              {profile.data.name || profile.data.handle}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              @{profile.data.handle}
            </Text>
          </Stack>
        </Group>
      ) : profile.isError ? (
        <Alert color="red" variant="light" p="xs">
          Couldn't load the connected account — the key may have been revoked.
        </Alert>
      ) : (
        <Group gap="xs" wrap="nowrap">
          <Skeleton height={32} width={32} radius="sm" />
          <Skeleton height={14} width={140} radius="sm" />
        </Group>
      )}

      <PasswordInput
        label="API key"
        value={props.apiKey}
        readOnly
        description="Stored locally in this browser."
      />

      {replacing ? (
        <KeyForm
          submitLabel="Replace key"
          onDone={() => setReplacing(false)}
          onCancel={() => setReplacing(false)}
        />
      ) : (
        <Group gap="xs">
          <Button variant="light" onClick={() => setReplacing(true)}>
            Replace key
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={() => void handleClear()}
          >
            Clear key
          </Button>
        </Group>
      )}
    </Stack>
  );
}

/**
 * Key entry form: validates the candidate against the profile endpoint and
 * persists it only on success.
 */
function KeyForm(props: {
  submitLabel: string;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const queryClient = useQueryClient();
  // Controlled only so the submit button can disable until something is typed.
  const [key, setKey] = useState("");

  const [error, submit, saving] = useActionState<string | null, FormData>(
    async (_prev, formData) => {
      const candidate = String(formData.get("key") ?? "").trim();
      if (!candidate) return null;
      try {
        const profile = await validateAndSaveApiKey(candidate);
        queryClient.clear(); // drop any previous account's cached data
        queryClient.setQueryData(queryKeys.profile, profile);
        props.onDone?.();
        return null;
      } catch {
        return "That API key didn't work. Check it and try again.";
      }
    },
    null,
  );

  return (
    <form action={submit}>
      <Stack gap="xs">
        <PasswordInput
          name="key"
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

        <Group gap="xs">
          <Button type="submit" loading={saving} disabled={!key.trim()}>
            {props.submitLabel}
          </Button>
          {props.onCancel && (
            <Button
              type="button"
              variant="subtle"
              color="gray"
              onClick={props.onCancel}
            >
              Cancel
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}

export default App;
