import { Suspense, useState } from "react";
import { Anchor, Badge, Group, Stack, Text, Tooltip } from "@mantine/core";
import { domainFromUrl } from "../../../../lib/activeTab";
import { CollectionsDrawer } from "../CollectionsDrawer";
import { ErrorBoundary } from "../ErrorBoundary";
import { SaversDrawer } from "../SaversDrawer";
import { UrlStatsRow } from "../UrlStatsRow";
import { UrlCardDetails, UrlCardImage, UrlCardStats } from "./UrlCardSections";
import {
  UrlCardDetailsSkeleton,
  UrlCardImageSkeleton,
} from "./Skeleton.UrlCardDetails";

/**
 * Preview of the current page. The domain and library badge render right away;
 * the metadata (title, description, image) and the Semble-wide stats each load
 * behind their own Suspense boundary, in parallel, so neither holds up the rest
 * of the popup — and a failure in either only degrades its own section.
 */
export function UrlCard(props: { url: string; inLibrary?: boolean }) {
  const domain = domainFromUrl(props.url);
  const [saversOpened, setSaversOpened] = useState(false);
  const [collectionsOpened, setCollectionsOpened] = useState(false);

  return (
    <>
      <Group
        justify="space-between"
        align="flex-start"
        wrap="nowrap"
        gap="md"
        flex={1}
        miw={0}
      >
        <Stack gap={2} miw={0} flex={1}>
          <Group gap={"xxs"} wrap="nowrap" miw={0}>
            <Tooltip label={props.url}>
              <Anchor
                href={props.url}
                target="_blank"
                rel="noreferrer"
                size="xs"
                c="blue"
                fw={500}
                lineClamp={1}
                style={{ flex: "0 1 auto", minWidth: 0 }}
              >
                {domain}
              </Anchor>
            </Tooltip>
            {props.inLibrary && (
              <Badge
                size="xs"
                color="green"
                variant="light"
                style={{ flexShrink: 0 }}
              >
                In library
              </Badge>
            )}
          </Group>
          {/* Keyed by URL so a failure on one page doesn't stick when the side
              panel follows the user to another tab. */}
          <ErrorBoundary
            key={`details:${props.url}`}
            fallback={
              <Text fw={600} size="sm" lineClamp={2}>
                {props.url}
              </Text>
            }
          >
            <Suspense fallback={<UrlCardDetailsSkeleton />}>
              <UrlCardDetails url={props.url} />
            </Suspense>
          </ErrorBoundary>
          {/* Skipped on failure (or when the API has no stats); the pending
              row reserves its exact height while the counts load. */}
          <ErrorBoundary key={`stats:${props.url}`} fallback={null}>
            <Suspense fallback={<UrlStatsRow stats="pending" />}>
              <UrlCardStats
                url={props.url}
                onSavesClick={() => setSaversOpened(true)}
                onCollectionsClick={() => setCollectionsOpened(true)}
              />
            </Suspense>
          </ErrorBoundary>
        </Stack>
        <ErrorBoundary key={`image:${props.url}`} fallback={null}>
          <Suspense fallback={<UrlCardImageSkeleton />}>
            <UrlCardImage url={props.url} />
          </Suspense>
        </ErrorBoundary>
      </Group>
      {/* Portal-rendered; kept out of the layout tree above. */}
      <SaversDrawer
        url={props.url}
        opened={saversOpened}
        onClose={() => setSaversOpened(false)}
      />
      <CollectionsDrawer
        url={props.url}
        opened={collectionsOpened}
        onClose={() => setCollectionsOpened(false)}
      />
    </>
  );
}
