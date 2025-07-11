import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Home, Palette, Plus, Bookmark, User } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = () => {
          const color = isFocused ? COLORS.white : COLORS.white;
          const size = 24;

          switch (route.name) {
            case 'index':
              return <Home size={size} color={color} />;
            case 'discover':
              return <Palette size={size} color={color} />;
            case 'create':
              return <Plus size={size} color={color} />;
            case 'saved':
              return <Bookmark size={size} color={color} />;
            case 'profile':
              return <User size={size} color={color} />;
            default:
              return <Home size={size} color={color} />;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              {getIcon()}
            </View>
            {isFocused && (
              <Text style={styles.label}>{label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.black,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.white,
    fontSize: 10,
    marginTop: 2,
  },
});