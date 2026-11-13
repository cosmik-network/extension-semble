import { useState } from "react";
import { AspectRatio, Image, Text } from "@mantine/core";
import { useUrlMetadata, useUrlStats } from "../../../../lib/queries";
import { UrlStatsRow } from "../UrlStatsRow";

// The suspending pieces of UrlCard. Details and image read the same metadata
// query, so they suspend on (and resolve with) a single request.

/** Title and description. Suspends on the URL's metadata. */
export function UrlCardDetails(props: { url: string }) {
  const metadata = useUrlMetadata(props.url).data;
  return (
    <>
      <Text fw={600} size="sm" lineClamp={2}>
        {metadata.title || metadata.url}
      </Text>
      {metadata.description && (
        <Text c="gray" fz="xs" mt={4} lineClamp={1}>
          {metadata.description}
        </Text>
      )}
    </>
  );
}

/** Thumbnail, if the page has one. Suspends on the URL's metadata. */
export function UrlCardImage(props: { url: string }) {
  const metadata = useUrlMetadata(props.url).data;
  const [imageError, setImageError] = useState(false);
  if (!metadata.imageUrl || imageError) return null;
  return (
    <AspectRatio ratio={1}>
      <Image
        src={metadata.imageUrl}
        alt=""
        radius="md"
        w={45}
        h={45}
        onError={() => setImageError(true)}
      />
    </AspectRatio>
  );
}

/** Semble-wide counts. Suspends on the URL's stats; renders nothing if none. */
export function UrlCardStats(props: {
  url: string;
  onSavesClick: () => void;
  onCollectionsClick: () => void;
}) {
  const stats = useUrlStats(props.url).data;
  if (!stats) return null;
  return (
    <UrlStatsRow
      stats={stats}
      onSavesClick={props.onSavesClick}
      onCollectionsClick={props.onCollectionsClick}
    />
  );
}
