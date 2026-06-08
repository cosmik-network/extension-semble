import { Stack, Textarea } from "@mantine/core";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function NoteEditor(props: Props) {
  return (
    <Stack gap={4}>
      <Textarea
        placeholder="Add a note…"
        variant="filled"
        autosize
        minRows={3}
        rows={3}
        maxRows={3}
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      />
    </Stack>
  );
}
