// ============================================================
// Chat Room Screen (alias)
// ============================================================
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ChatRoomRedirect() {
  const params = useLocalSearchParams();
  return <Redirect href={`/messages/${params.chatId || '1'}`} />;
}
