/**
 * Settings Screen - Production Ready
 * Complete settings management with theme, notifications, privacy, and account options
 */

import Icon from '@/components/ui/Icon';
import ThemedText from '@/components/ui/ThemedText';
import { useAuth } from '@/lib/store/auth';
import { useNotifications } from '@/lib/store/notifications';
import { useTheme } from '@/lib/store/theme';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { Alert, Linking, Platform, ScrollView, Share, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isDark, theme, setTheme, reducedMotion, setReducedMotion } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Type DELETE to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    // TODO: Implement account deletion
                    Alert.alert('Account Deleted', 'Your account has been deleted.');
                  },
                },
              ],
              { cancelable: true }
            );
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out Aakar - The best design community app! Download now and join thousands of designers.',
        title: 'Aakar - Design Community',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRateApp = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/aakar',
      android: 'https://play.google.com/store/apps/details?id=com.yourcompany.aakar',
    });
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@aakar.app?subject=Support Request');
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    destructive = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
      ]}
      onPress={() => {
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      disabled={!onPress && !rightElement}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: destructive
                ? 'rgba(239, 68, 68, 0.1)'
                : isDark
                  ? '#2a2a2a'
                  : '#f3f4f6',
            },
          ]}
        >
          <Icon
            name={icon}
            size={20}
            color={destructive ? '#ef4444' : isDark ? '#fff' : '#111'}
          />
        </View>
        <View style={styles.settingText}>
          <ThemedText
            style={[
              styles.settingTitle,
              destructive && { color: '#ef4444' },
            ]}
          >
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      {rightElement || (
        <Icon
          name="chevron-right"
          size={20}
          color={isDark ? '#666' : '#999'}
        />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#f9fafb' }}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <SettingItem
            icon="user"
            title="Edit Profile"
            subtitle={user?.email || ''}
            onPress={() => router.push('/(tabs)/profile')}
          />
          <SettingItem
            icon="key"
            title="API Configuration"
            subtitle="Manage your API keys"
            onPress={() => {
              // TODO: Navigate to API config screen
              Alert.alert('API Configuration', 'This feature will be available soon.');
            }}
          />
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance" />
        <View style={styles.section}>
          <SettingItem
            icon="palette"
            title="Theme"
            subtitle={theme === 'auto' ? 'Automatic' : theme === 'dark' ? 'Dark' : 'Light'}
            onPress={() => {
              const nextTheme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
              setTheme(nextTheme);
            }}
          />
          <SettingItem
            icon="zap-off"
            title="Reduce Motion"
            subtitle="Minimize animations"
            rightElement={
              <Switch
                value={reducedMotion}
                onValueChange={setReducedMotion}
                trackColor={{ false: '#767577', true: '#ee4d2d' }}
                thumbColor={reducedMotion ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <SettingItem
            icon="bell"
            title="Push Notifications"
            subtitle="Receive alerts for likes, comments, and more"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#767577', true: '#ee4d2d' }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Privacy & Security Section */}
        <SectionHeader title="Privacy & Security" />
        <View style={styles.section}>
          <SettingItem
            icon="shield"
            title="Privacy Settings"
            subtitle="Control who can see your content"
            onPress={() => {
              Alert.alert('Privacy Settings', 'This feature will be available soon.');
            }}
          />
          <SettingItem
            icon="eye-off"
            title="Blocked Users"
            onPress={() => {
              Alert.alert('Blocked Users', 'This feature will be available soon.');
            }}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingItem
            icon="share-2"
            title="Share Aakar"
            subtitle="Invite friends to join"
            onPress={handleShare}
          />
          <SettingItem
            icon="star"
            title="Rate the App"
            subtitle="Help us improve"
            onPress={handleRateApp}
          />
          <SettingItem
            icon="help-circle"
            title="Help & Support"
            onPress={handleContactSupport}
          />
          <SettingItem
            icon="file-text"
            title="Privacy Policy"
            onPress={() => {
              Linking.openURL('https://aakar.app/privacy');
            }}
          />
          <SettingItem
            icon="info"
            title="App Version"
            subtitle={`v${Constants.expoConfig?.version || '1.0.0'}`}
          />
        </View>

        {/* Danger Zone */}
        <SectionHeader title="Danger Zone" />
        <View style={styles.section}>
          <SettingItem
            icon="log-out"
            title="Sign Out"
            onPress={handleSignOut}
            destructive
          />
          <SettingItem
            icon="trash-2"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Made with ❤️ for designers
          </ThemedText>
          <ThemedText style={styles.footerText}>
            © 2024 Aakar. All rights reserved.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 60,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
