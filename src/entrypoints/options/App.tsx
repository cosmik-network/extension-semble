import { Anchor, Card, Center, Stack, Text, Title } from "@mantine/core";
import { useApiKey } from "../../lib/hooks";
import { AccountSettings, KeyForm } from "../popup/components/AccountSettings";
import { AppPreferences } from "../popup/components/AppPreferences";

/** Extension settings page: view, set/replace, and clear the API key. */
function App() {
  const apiKey = useApiKey();

  return (
    <Center mih="100vh" p="md">
      <Card w={480} withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Title order={3}>Semble Settings</Title>
          {apiKey ? (
            <>
              <AccountSettings />
              <AppPreferences />
            </>
          ) : (
            <SetupView />
          )}
        </Stack>
      </Card>
    </Center>
  );
}

/** No key yet: explain where to get one and offer the entry form. */
function SetupView() {
  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        Connect your Semble account by pasting an API key. You can create one
        at{" "}
        <Anchor
          href="https://semble.so/settings/api-keys"
          target="_blank"
          rel="noreferrer"
          size="sm"
        >
          semble.so/settings/api-keys
        </Anchor>
        .
      </Text>
      <KeyForm submitLabel="Save key" />
    </Stack>
  );
}

export default App;
