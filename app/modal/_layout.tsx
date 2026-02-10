// ============================================================
// Modal Layout
// ============================================================
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="image-preview" />
      <Stack.Screen name="user-actions" />
    </Stack>
  );
}
