import { useState } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Tooltip,
} from "@mantine/core";
import { BsTrash2Fill } from "react-icons/bs";
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
 * The "Manage" tab: pick collections, edit the note, save/remove. Holds the
 * local (unsaved) edits; `urlState` is the persisted server state. Mount with
 * `key={urlState.cardId}` so the edits reset when the card is added/removed.
 */
export function ManageTab({ url, urlState, collections }: Props) {
  const cardId = urlState.cardId;

  // Local, unsaved edits (server state lives in the urlState query).
  const [selectedIds, setSelectedIds] = useState(urlState.collectionIds);
  const [note, setNote] = useState(urlState.note);

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

  function handleToggle(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  }

  async function handleCreateCollection(name: string) {
    try {
      const id = await createCollection.mutateAsync(name);
      setSelectedIds((prev) => [...prev, id]);
    } catch {
      // Surfaced via createCollection.error.
    }
  }

  async function handleSave() {
    try {
      if (!cardId) {
        await addToLibrary.mutateAsync({
          url,
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
          {error.message}
        </Alert>
      )}

      {/* Scrolls; header/tabs above and buttons below stay put */}
      <ScrollArea type="auto" style={{ flex: 1, minHeight: 0 }}>
        <Stack gap="sm">
          <CollectionPicker
            collections={collections}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onCreate={handleCreateCollection}
          />

          <Divider />

          <NoteEditor value={note} onChange={setNote} />
        </Stack>
      </ScrollArea>

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
