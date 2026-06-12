import {
  ActionIcon,
  Button,
  Card,
  Combobox,
  Group,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { LuArrowUpDown, LuChevronsUpDown } from "react-icons/lu";
import {
  CONNECTION_TYPES,
  type ConnectionType,
} from "../../../../lib/connections";
import { CONNECTION_TYPE_CONFIG } from "../ConnectionItem";

interface Props {
  value: ConnectionType;
  onChange: (value: ConnectionType) => void;
  onSwap: () => void;
  /** Swapping is meaningless until the other end has been picked. */
  swapDisabled: boolean;
}

/**
 * The pill between the two endpoint cards, mirroring the web app's
 * AddConnectionForm: the connection-type picker (a combobox with per-type
 * descriptions) next to the swap-direction button.
 */
export function ConnectionTypeSelector(props: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selected = CONNECTION_TYPE_CONFIG[props.value];
  const SelectedIcon = selected.icon;

  return (
    <Card
      radius="xl"
      bg="var(--mantine-color-default-hover)"
      p="xs"
      w="fit-content"
      mx="auto"
    >
      <Group gap="xs" align="center" justify="center">
        <Combobox
          shadow="sm"
          radius="md"
          store={combobox}
          position="bottom"
          width={300}
          onOptionSubmit={(value) => {
            props.onChange(value as ConnectionType);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <Button
              color="green"
              size="xs"
              onClick={() => combobox.toggleDropdown()}
              leftSection={<SelectedIcon size={16} />}
              rightSection={<LuChevronsUpDown />}
            >
              {selected.label}
            </Button>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>
              <ScrollArea.Autosize type="scroll" mah={220}>
                {CONNECTION_TYPES.map((type) => {
                  const config = CONNECTION_TYPE_CONFIG[type];
                  const Icon = config.icon;
                  const isSelected = props.value === type;
                  return (
                    <Combobox.Option
                      key={type}
                      value={type}
                      p={5}
                      bg={
                        isSelected
                          ? "var(--mantine-color-green-light)"
                          : undefined
                      }
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Icon size={20} color="green" />
                        <Stack gap={0} style={{ flex: 1 }}>
                          <Text
                            size="sm"
                            c="bright"
                            fw={isSelected ? 600 : 500}
                          >
                            {config.label}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {config.description}
                          </Text>
                        </Stack>
                      </Group>
                    </Combobox.Option>
                  );
                })}
              </ScrollArea.Autosize>
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Tooltip
          label={
            props.swapDisabled
              ? "You need to add a link before swapping"
              : "Swap"
          }
          position="top"
        >
          <ActionIcon
            variant="light"
            size="lg"
            color="blue"
            radius="xl"
            aria-label="Swap direction"
            onClick={props.onSwap}
            disabled={props.swapDisabled}
          >
            <LuArrowUpDown size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}
