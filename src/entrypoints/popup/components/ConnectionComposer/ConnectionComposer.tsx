import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { BiSolidChevronDown } from "react-icons/bi";
import { domainFromUrl, faviconUrl } from "../../../../lib/activeTab";
import type { ConnectionType } from "../../../../lib/connections";
import { describeError } from "../../../../lib/errors";
import type { UrlState } from "../../../../lib/library";
import { useCreateConnection } from "../../../../lib/mutations";
import { queryKeys } from "../../../../lib/queries/queryKeys";
import { CONNECTION_TYPE_CONFIG } from "../ConnectionItem";
import { NoteEditor } from "../NoteEditor";
import { ConnectionTypeSelector } from "./ConnectionTypeSelector";
import { TargetPicker, type SelectedTarget } from "./TargetPicker";

interface Props {
  url: string;
  onClose: () => void;
  /** Called after a connection is successfully created (distinct from cancel). */
  onCreated: () => void;
}

/** Canonical form for the "same page" check (e.g. adds the trailing slash). */
function normalizeUrl(url: string): string {
  try {
    return new URL(url).toString();
  } catch {
    return url;
  }
}

/**
 * Inline form for creating a connection, mirroring the web app's
 * AddConnectionForm layout: source card, a connector line down to the
 * type-picker/swap pill, a chevron pointing at the target, then the note.
 * The source is always the top card; swapping reorders the cards so the
 * current page can be either end.
 */
export function ConnectionComposer(props: Props) {
  const [flipped, setFlipped] = useState(false);
  const [target, setTarget] = useState<SelectedTarget | undefined>();
  const [connectionType, setConnectionType] =
    useState<ConnectionType>("RELATED");
  const [note, setNote] = useState("");

  const createConnection = useCreateConnection();

  // Cache-only read: the main view has already loaded this page's state.
  const queryClient = useQueryClient();
  const pageMetadata = queryClient.getQueryData<UrlState>(
    queryKeys.urlState.byUrl(props.url),
  )?.metadata;

  const samePage =
    !!target && normalizeUrl(target.url) === normalizeUrl(props.url);
  const canSubmit = !!target && !samePage;

  async function handleSubmit() {
    if (!target) return;
    try {
      await createConnection.mutateAsync({
        sourceUrl: flipped ? target.url : props.url,
        targetUrl: flipped ? props.url : target.url,
        connectionType,
        note,
      });
      props.onCreated();
    } catch {
      // Surfaced via createConnection.error.
    }
  }

  const currentPageRow = (
    <Card withBorder radius="lg" p="xs">
      <Group gap="xs" wrap="nowrap">
        {pageMetadata?.imageUrl ? (
          <Image
            src={pageMetadata.imageUrl}
            alt=""
            radius="md"
            w={32}
            h={32}
            style={{ flexShrink: 0 }}
          />
        ) : (
          <Image src={faviconUrl(props.url, 32)} alt="" w={16} h={16} />
        )}
        <Stack gap={0} flex={1} miw={0}>
          <Text fw={500} c="bright" fz="sm" lineClamp={1}>
            {pageMetadata?.title ?? props.url}
          </Text>
          <Group gap={4} wrap="nowrap">
            <Text c="gray" fz="xs" lineClamp={1}>
              {domainFromUrl(props.url)}
            </Text>
            <Badge
              size="xs"
              variant="light"
              color="gray"
              style={{ flexShrink: 0 }}
            >
              This page
            </Badge>
          </Group>
        </Stack>
      </Group>
    </Card>
  );

  const targetRow = <TargetPicker selected={target} onSelect={setTarget} />;

  return (
    <Stack gap="sm" h="100%">
      {createConnection.error && (
        <Alert color="red" variant="light">
          {describeError(createConnection.error)}
        </Alert>
      )}

      {/* Scrolls; the buttons below stay pinned to the bottom. */}
      <ScrollArea type="auto" style={{ flex: 1, minHeight: 0 }}>
        <Stack gap="sm">
          {/* Source → type/swap pill → target, like the web app's drawer. */}
          <Stack gap={0}>
            {flipped ? targetRow : currentPageRow}

            <Divider orientation="vertical" size="md" h={16} mx="auto" />

            <ConnectionTypeSelector
              value={connectionType}
              onChange={setConnectionType}
              onSwap={() => setFlipped((f) => !f)}
              swapDisabled={!target}
            />

            <Stack align="center" gap={0}>
              <Divider orientation="vertical" size="md" h={16} mx="auto" />
              <ThemeIcon
                size="xs"
                color="var(--mantine-color-disabled-border)"
                c="gray"
                radius="xl"
              >
                <BiSolidChevronDown size={12} />
              </ThemeIcon>
            </Stack>

            {flipped ? currentPageRow : targetRow}
          </Stack>

          <NoteEditor
            value={note}
            onChange={setNote}
            placeholder={CONNECTION_TYPE_CONFIG[connectionType].notePlaceholder}
          />

          {samePage && (
            <Text fz="xs" c="red">
              Can't connect a page to itself.
            </Text>
          )}
        </Stack>
      </ScrollArea>

      <Group gap="xs" wrap="nowrap">
        <Button
          radius="md"
          variant="light"
          color="gray"
          disabled={createConnection.isPending}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          radius="md"
          style={{ flex: 1 }}
          loading={createConnection.isPending}
          disabled={!canSubmit}
          onClick={() => void handleSubmit()}
        >
          Create
        </Button>
      </Group>
    </Stack>
  );
}
