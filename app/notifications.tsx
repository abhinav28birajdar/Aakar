import { Button } from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    title: 'New Design Uploaded',
    message: 'John Doe uploaded a new kitchen design',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Design Approved',
    message: 'Your living room design has been approved',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '3',
    title: 'New Comment',
    message: 'Sarah commented on your bedroom design',
    timestamp: '3 days ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const renderNotification = ({ item }: { item: typeof mockNotifications[0] }) => (
    <ThemedView style={styles.notificationItem}>
      <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.notificationMessage}>{item.message}</ThemedText>
      <ThemedText style={styles.notificationTime}>{item.timestamp}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Notifications</ThemedText>
      
      <FlatList
        data={mockNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <Button
        title="Back"
        onPress={() => router.back()}
        style={styles.backButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  list: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 103, 0, 0.1)',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  backButton: {
    marginTop: 20,
  },
});
