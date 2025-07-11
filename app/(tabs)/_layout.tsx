import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { TabBar } from '@/components/TabBar';
import { Logo } from '@/components/Logo';
import { Avatar } from '@/components/Avatar';
import { Bell } from 'lucide-react-native';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useUser } from '@/hooks/useUser';

export default function TabLayout() {
  const { user } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          shadowOpacity: 0,
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <Logo size="small" />,
        headerLeft: () => (
          <Avatar 
            uri={user?.avatarUrl} 
            size={32} 
            style={styles.headerAvatar} 
          />
        ),
        headerRight: () => (
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={24} color={COLORS.black} />
          </TouchableOpacity>
        ),
      }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerAvatar: {
    marginLeft: 16,
  },
  headerIcon: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});