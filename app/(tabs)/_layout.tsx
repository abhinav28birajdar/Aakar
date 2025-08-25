import { Avatar } from '@/components/Avatar';
import { Logo } from '@/components/Logo';
import { TabBar } from '@/components/TabBar';
import Icon from '@/components/ui/Icon';
import ThemedText from '@/components/ui/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/helpers';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View 
            className={cn(
              "absolute inset-0 rounded-t-3xl",
              isDark ? "bg-dark-card" : "bg-card"
            )} 
          />
        ),
        headerStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <Logo size="small" />,
        headerLeft: () => (
          <TouchableOpacity 
            className="ml-4 rounded-full overflow-hidden"
            onPress={() => router.push('/profile')}
          >
            <Avatar 
              uri={user?.avatar_url}
              size="sm"
              fallback={user?.display_name?.[0] || 'A'} 
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity 
            className="mr-4 w-10 h-10 justify-center items-center"
            onPress={() => router.push('/notifications')}
          >
            <View className="relative">
              <Icon 
                name="bell" 
                size={24} 
                className={isDark ? "text-white" : "text-black"} 
              />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 justify-center items-center">
                  <ThemedText className="text-white text-xs font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </ThemedText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      }}
      tabBar={props => <TabBar {...props} />}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View className={cn("items-center", focused && "mt-[-5px]")}>
              <Icon 
                name="layout-dashboard" 
                size={focused ? 28 : 24}
                className={focused ? "text-primary" : "text-muted-foreground"}
              />
              {focused && (
                <View className="w-2 h-2 rounded-full bg-primary mt-1" />
              )}
            </View>
          ),
        }}
      />

      {/* Discover/Search Tab */}
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <View className={cn("items-center", focused && "mt-[-5px]")}>
              <Icon 
                name="search" 
                size={focused ? 28 : 24}
                className={focused ? "text-primary" : "text-muted-foreground"}
              />
              {focused && (
                <View className="w-2 h-2 rounded-full bg-primary mt-1" />
              )}
            </View>
          ),
        }}
      />

      {/* Create/Upload Tab */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              className="w-16 h-16 bg-primary rounded-full justify-center items-center -mb-8 shadow-xl shadow-primary/50"
              onPress={() => router.push('/designer/edit')}
            >
              <Icon name="plus" size={36} className="text-white" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Saved/Collections Tab */}
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <View className={cn("items-center", focused && "mt-[-5px]")}>
              <Icon 
                name="bookmark" 
                size={focused ? 28 : 24}
                className={focused ? "text-primary" : "text-muted-foreground"}
              />
              {focused && (
                <View className="w-2 h-2 rounded-full bg-primary mt-1" />
              )}
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <View className={cn("items-center", focused && "mt-[-5px]")}>
              <Icon 
                name="user" 
                size={focused ? 28 : 24}
                className={focused ? "text-primary" : "text-muted-foreground"}
              />
              {focused && (
                <View className="w-2 h-2 rounded-full bg-primary mt-1" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}