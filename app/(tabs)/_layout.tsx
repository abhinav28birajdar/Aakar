import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react-native';
import { Platform, View } from 'react-native';

export default function TabsLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <View style={{
                            backgroundColor: colors.primary,
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: -5
                        }}>
                            <PlusSquare size={24} color="white" />
                        </View>
                    ),
                    tabBarLabel: () => null
                }}
            />
            <Tabs.Screen
                name="activity"
                options={{
                    title: 'Activity',
                    tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
                    tabBarBadge: 3,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    href: null, // Hide from tab bar but keep route
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
