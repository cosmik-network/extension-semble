import { Stack, Textarea } from "@mantine/core";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function NoteEditor({ value, onChange }: Props) {
  return (
    <Stack gap={4}>
      <Textarea
        placeholder="Add a note…"
        variant="filled"
        autosize
        minRows={3}
        rows={3}
        maxRows={3}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </Stack>
  );
}
