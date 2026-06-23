import { useActionState, useState } from "react";
import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  CopyButton,
  Group,
  PasswordInput,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { FiCheck, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useApiKey } from "../../../../lib/hooks";
import { validateAndSaveApiKey } from "../../../../lib/library";
import { useMyProfile } from "../../../../lib/queries";
import { queryKeys } from "../../../../lib/queries/queryKeys";
import { clearApiKey } from "../../../../lib/semble";

/**
 * Connected-account settings: the signed-in profile plus the masked API key,
 * with actions to replace it or log out. Shared by the options page and the
 * in-popup settings view. `onCleared` fires after the key is removed so the
 * popup can return to its main view.
 */
export function AccountSettings(props: { onCleared?: () => void }) {
  const apiKey = useApiKey();
  const queryClient = useQueryClient();
  const profile = useMyProfile();
  const [replacing, setReplacing] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);

  async function handleClear() {
    await clearApiKey();
    queryClient.clear();
    props.onCleared?.();
  }

  if (!apiKey) return null;

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
        value={apiKey}
        readOnly
        description="Stored locally in this browser."
        visible={keyVisible}
        onVisibilityChange={setKeyVisible}
        rightSectionWidth={68}
        rightSection={
          <Group gap={2} wrap="nowrap">
            <Tooltip
              label={keyVisible ? "Hide key" : "Show key"}
              withArrow
              position="top"
            >
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setKeyVisible((v) => !v)}
                aria-label={keyVisible ? "Hide API key" : "Show API key"}
              >
                {keyVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </ActionIcon>
            </Tooltip>
            <CopyButton value={apiKey} timeout={1500}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy key"}
                  withArrow
                  position="top"
                >
                  <ActionIcon
                    variant="subtle"
                    color={copied ? "teal" : "gray"}
                    onClick={copy}
                    aria-label="Copy API key"
                  >
                    {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        }
      />

      {replacing ? (
        <KeyForm
          submitLabel="Replace key"
          placeholder="Add your new API key"
          onDone={() => setReplacing(false)}
          onCancel={() => setReplacing(false)}
        />
      ) : (
        <Group gap="xs">
          <Button
            variant="light"
            color="gray"
            onClick={() => setReplacing(true)}
          >
            Replace key
          </Button>
          <Button
            variant="subtle"
            color="red"
            onClick={() => void handleClear()}
          >
            Log out
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
export function KeyForm(props: {
  submitLabel: string;
  placeholder?: string;
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
          placeholder={props.placeholder ?? "Add your API key"}
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
