import { useState } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Divider,
  Group,
  Stack,
  Tooltip,
} from "@mantine/core";
import { BsTrash2Fill } from "react-icons/bs";
import { describeError } from "../../../../lib/errors";
import type { CollectionSummary, UrlState } from "../../../../lib/library";
import {
  useAddToLibrary,
  useCreateCollection,
  useRemoveFromLibrary,
  useUpdateCard,
} from "../../../../lib/mutations";
import { CollectionPicker } from "../CollectionPicker";
import { NoteEditor } from "../NoteEditor";

interface Props {
  url: string;
  urlState: UrlState;
  collections: CollectionSummary[];
}

function sameSet(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((x) => b.includes(x));
}

/**
 * The Add/Update tab: pick collections, edit the note, save/remove. Holds the
 * local (unsaved) edits; `urlState` is the persisted server state. Mount with
 * `key={urlState.cardId}` so the edits reset when the card is added/removed.
 */
export function ManageTab(props: Props) {
  const { urlState } = props;
  const cardId = urlState.cardId;

  // Local, unsaved edits (server state lives in the urlState query).
  const [selectedIds, setSelectedIds] = useState(urlState.collectionIds);
  const [note, setNote] = useState(urlState.note);
  // Summaries of collections we've seen (seeded from the saved ones), so the
  // picker can render selected collections by name even when they aren't in the
  // active tab's fetched list (e.g. open collections owned by someone else).
  const [knownCollections, setKnownCollections] = useState(
    () => new Map(urlState.collections.map((col) => [col.id, col])),
  );

  const selectedCollections = selectedIds
    .map((id) => knownCollections.get(id))
    .filter((col): col is CollectionSummary => !!col);

  const addToLibrary = useAddToLibrary();
  const updateCard = useUpdateCard();
  const removeFromLibrary = useRemoveFromLibrary();
  const createCollection = useCreateCollection();

  const saving = addToLibrary.isPending || updateCard.isPending;
  const removing = removeFromLibrary.isPending;
  const error =
    addToLibrary.error ??
    updateCard.error ??
    removeFromLibrary.error ??
    createCollection.error;

  const dirty =
    !cardId ||
    note !== urlState.note ||
    !sameSet(selectedIds, urlState.collectionIds);

  function handleToggle(collection: CollectionSummary, checked: boolean) {
    setKnownCollections((prev) =>
      prev.has(collection.id)
        ? prev
        : new Map(prev).set(collection.id, collection),
    );
    setSelectedIds((prev) =>
      checked
        ? [...prev, collection.id]
        : prev.filter((x) => x !== collection.id),
    );
  }

  async function handleCreateCollection(
    name: string,
    accessType: "OPEN" | "CLOSED",
  ) {
    try {
      const id = await createCollection.mutateAsync({ name, accessType });
      setKnownCollections((prev) =>
        new Map(prev).set(id, { id, name: name.trim(), accessType }),
      );
      setSelectedIds((prev) => [...prev, id]);
    } catch {
      // Surfaced via createCollection.error.
    }
  }

  async function handleSave() {
    try {
      if (!cardId) {
        await addToLibrary.mutateAsync({
          url: props.url,
          note,
          collectionIds: selectedIds,
        });
        return;
      }
      const addToCollections = selectedIds.filter(
        (id) => !urlState.collectionIds.includes(id),
      );
      const removeFromCollections = urlState.collectionIds.filter(
        (id) => !selectedIds.includes(id),
      );
      await updateCard.mutateAsync({
        cardId,
        note: note !== urlState.note ? note : undefined,
        noteCardId: urlState.noteCardId,
        addToCollections: addToCollections.length
          ? addToCollections
          : undefined,
        removeFromCollections: removeFromCollections.length
          ? removeFromCollections
          : undefined,
      });
    } catch {
      // Surfaced via the mutations' error state.
    }
  }

  function handleRemove() {
    if (!cardId) return;
    removeFromLibrary.mutate(cardId);
  }

  return (
    <Stack gap="sm" h="100%">
      {error && (
        <Alert color="red" variant="light">
          {describeError(error)}
        </Alert>
      )}

      {/* The picker absorbs all free space and its list is the only scroll
          region, so the divider/note/buttons stay anchored at the bottom —
          toggling the picker's search never moves them. */}
      <CollectionPicker
        collections={props.collections}
        selectedCollections={selectedCollections}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onCreate={handleCreateCollection}
      />

      <Divider />

      <NoteEditor value={note} onChange={setNote} />

      {/* Pinned to the bottom */}
      <Group gap="xs" wrap="nowrap">
        {cardId && (
          <Tooltip label="Remove from library">
            <ActionIcon
              size={36}
              radius="md"
              variant="subtle"
              color="red"
              aria-label="Remove from library"
              loading={removing}
              disabled={saving}
              onClick={handleRemove}
            >
              <BsTrash2Fill size={16} />
            </ActionIcon>
          </Tooltip>
        )}

        <Button
          radius={"md"}
          variant="light"
          color="gray"
          disabled={saving || removing}
          onClick={() => window.close()}
        >
          Cancel
        </Button>

        <Button
          radius={"md"}
          style={{ flex: 1 }}
          loading={saving}
          disabled={!dirty || removing}
          onClick={() => void handleSave()}
        >
          {cardId ? "Update" : "Add to library"}
        </Button>
      </Group>
    </Stack>
  );
}
