import { Stack } from 'expo-router';

export default function ModalLayout() {
    return (
        <Stack screenOptions={{ presentation: 'modal', headerShown: false }}>
            <Stack.Screen name="image-preview" />
            <Stack.Screen name="user-actions" />
        </Stack>
    );
}
