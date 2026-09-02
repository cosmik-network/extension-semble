import { Stack, Textarea } from "@mantine/core";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NoteEditor(props: Props) {
  return (
    <Stack gap={4}>
      <Textarea
        placeholder={props.placeholder ?? "Add a note…"}
        variant="filled"
        autosize
        minRows={2}
        rows={2}
        maxRows={2}
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      />
    </Stack>
  );
}
