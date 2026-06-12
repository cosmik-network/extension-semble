import { useState } from "react";
import {
  Badge,
  Card,
  CloseButton,
  Group,
  Image,
  Input,
  Popover,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FiSearch } from "react-icons/fi";
import {
  domainFromUrl,
  faviconUrl,
  isSupportedUrl,
} from "../../../../lib/activeTab";
import { describeError } from "../../../../lib/errors";
import { useSembleSearch } from "../../../../lib/queries";
import classes from "./ConnectionComposer.module.css";

export interface SelectedTarget {
  url: string;
  title?: string;
  imageUrl?: string;
}

interface Props {
  selected: SelectedTarget | undefined;
  onSelect: (target: SelectedTarget | undefined) => void;
}

/** The input as a usable URL: as-is, or with https:// added to a bare domain. */
function asUrl(input: string): string | undefined {
  if (isSupportedUrl(input)) return input;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(input)) {
    const candidate = `https://${input}`;
    if (isSupportedUrl(candidate)) return candidate;
  }
  return undefined;
}

/**
 * Picks the other end of a connection: one input that accepts a pasted URL
 * (offered back as "Use this URL") or searches Semble as you type. Once a
 * target is chosen the input is replaced by a card preview with a remove
 * button, like the web app's UrlSearchInput.
 */
export function TargetPicker(props: Props) {
  const [query, setQuery] = useState("");
  const [debounced] = useDebouncedValue(query, 300);

  const trimmed = debounced.trim();
  const urlCandidate = asUrl(trimmed);
  const search = useSembleSearch(trimmed, { enabled: !urlCandidate });

  if (props.selected) {
    const selected = props.selected;
    return (
      <Card withBorder radius="lg" p="xs">
        <Group gap="xs" wrap="nowrap">
          {selected.imageUrl ? (
            <Image
              src={selected.imageUrl}
              alt=""
              radius="md"
              w={32}
              h={32}
              style={{ flexShrink: 0 }}
            />
          ) : (
            <Image src={faviconUrl(selected.url, 32)} alt="" w={16} h={16} />
          )}
          <Stack gap={0} flex={1} miw={0}>
            <Text fw={500} c="bright" fz="sm" lineClamp={1}>
              {selected.title ?? selected.url}
            </Text>
            <Text c="gray" fz="xs" lineClamp={1}>
              {domainFromUrl(selected.url)}
            </Text>
          </Stack>
          <CloseButton
            radius="xl"
            aria-label="Remove URL"
            onClick={() => props.onSelect(undefined)}
          />
        </Group>
      </Card>
    );
  }

  const results = search.data?.pages.flatMap((page) => page.urls) ?? [];

  return (
    // Dropdown floats over the form (note/buttons) instead of pushing them
    // down. Controlled by the query so it opens as results load and closes
    // when the field is cleared; trapFocus off so typing stays in the input.
    <Popover
      opened={!!trimmed}
      position="bottom-start"
      width="target"
      shadow="md"
      radius="md"
      trapFocus={false}
      returnFocus={false}
    >
      <Popover.Target>
        <TextInput
          size="sm"
          variant="filled"
          placeholder="Search or paste a link"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          leftSection={<FiSearch size={14} />}
          rightSectionPointerEvents="auto"
          rightSection={
            query ? (
              <Input.ClearButton onClick={() => setQuery("")} />
            ) : undefined
          }
        />
      </Popover.Target>

      <Popover.Dropdown p="xxs">
        {urlCandidate ? (
          <UnstyledButton
            className={classes.option}
            py="xxs"
            px="xs"
            onClick={() => props.onSelect({ url: urlCandidate })}
          >
            <Group gap="xs" wrap="nowrap">
              <Image src={faviconUrl(urlCandidate, 32)} alt="" w={16} h={16} />
              <Text fz="sm" fw={500} style={{ flexShrink: 0 }}>
                Use this URL
              </Text>
              <Text c="dimmed" fz="xs" lineClamp={1}>
                {urlCandidate}
              </Text>
            </Group>
          </UnstyledButton>
        ) : (
          <ScrollArea.Autosize mah={250}>
            <Stack gap={0}>
              {search.isPending ? (
                <Stack gap="xxs">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i} height={40} radius="md" />
                  ))}
                </Stack>
              ) : search.isError ? (
                <Text fz="xs" c="red">
                  {describeError(search.error)}
                </Text>
              ) : results.length === 0 ? (
                <Text fz="xs" fw={500} c="dimmed" mx="auto" my="xs">
                  No results found
                </Text>
              ) : (
                results.map((item) => (
                  <UnstyledButton
                    key={item.metadata.url}
                    className={classes.option}
                    py="xxs"
                    px="xxs"
                    onClick={() =>
                      props.onSelect({
                        url: item.metadata.url,
                        title: item.metadata.title,
                        imageUrl: item.metadata.imageUrl,
                      })
                    }
                  >
                    <Stack gap={0}>
                      <Group gap={4} wrap="nowrap">
                        <Text fw={500} c="bright" fz="sm" lineClamp={1}>
                          {item.metadata.title ?? item.metadata.url}
                        </Text>
                        {item.inLibrary && (
                          <Badge
                            size="xs"
                            color="green"
                            variant="light"
                            style={{ flexShrink: 0 }}
                          >
                            Saved
                          </Badge>
                        )}
                      </Group>
                      <Text c="gray" fz="xs" lineClamp={1}>
                        {domainFromUrl(item.metadata.url)}
                      </Text>
                    </Stack>
                  </UnstyledButton>
                ))
              )}
            </Stack>
          </ScrollArea.Autosize>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
