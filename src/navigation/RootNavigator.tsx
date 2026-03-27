import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, Plus, Bell, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

// Screens
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import CreateScreen from '../screens/Create/CreateScreen';
import ActivityScreen from '../screens/Activity/ActivityScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#818CF8', 
        shadowColor: '#818CF8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#818CF8',
        tabBarInactiveTintColor: '#4B5563',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => <Compass color={color} size={24} />,
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ }) => <Plus color="#FFFFFF" size={32} strokeWidth={2.5} />,
          tabBarButton: (props) => <CustomTabButton {...props} />,
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Bell color={color} size={24} />
              <View 
                style={{ 
                  position: 'absolute', 
                  right: -6, 
                  top: -3, 
                  backgroundColor: '#EF4444', 
                  borderRadius: 7, 
                  width: 14, 
                  height: 14, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: '#000000',
                }}
              >
                <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>3</Text>
              </View>
            </View>
          ),
          tabBarLabel: 'Activity',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { user, loading } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem('hasBoarded');
      setHasOnboarded(onboarded === 'true');
    };
    checkOnboarding();
  }, []);

  if (loading || hasOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#818CF8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        ) : (
          <>
            {!hasOnboarded && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
