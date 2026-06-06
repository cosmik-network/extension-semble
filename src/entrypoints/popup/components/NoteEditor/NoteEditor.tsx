import { Stack, Text, Textarea } from "@mantine/core";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function NoteEditor({ value, onChange }: Props) {
  return (
    <Stack gap={4}>
      {/*<Text size="sm" fw={500}>
        Note
      </Text>*/}
      <Textarea
        placeholder="Add a note…"
        variant="filled"
        autosize
        minRows={3}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </Stack>
  );
}
