
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { Briefcase, Palette } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Role = 'designer' | 'client' | null;

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // In a real app, we would update the user's role in Firestore
      // For demo purposes, we'll just navigate to the main app
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size="medium" showTagline />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.heading}>Select your role</Text>
        <Text style={styles.description}>
          Choose how you'll primarily use Aakar. You can always change this later.
        </Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'designer' && styles.selectedRoleCard,
            ]}
            onPress={() => handleRoleSelect('designer')}
            activeOpacity={0.8}
          >
            <Palette 
              size={40} 
              color={selectedRole === 'designer' ? COLORS.white : COLORS.black} 
            />
            <Text 
              style={[
                styles.roleTitle,
                selectedRole === 'designer' && styles.selectedRoleText,
              ]}
            >
              I am a Designer
            </Text>
            <Text 
              style={[
                styles.roleDescription,
                selectedRole === 'designer' && styles.selectedRoleText,
              ]}
            >
              Showcase your work and connect with clients
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'client' && styles.selectedRoleCard,
            ]}
            onPress={() => handleRoleSelect('client')}
            activeOpacity={0.8}
          >
            <Briefcase 
              size={40} 
              color={selectedRole === 'client' ? COLORS.white : COLORS.black} 
            />
            <Text 
              style={[
                styles.roleTitle,
                selectedRole === 'client' && styles.selectedRoleText,
              ]}
            >
              I am a Client
            </Text>
            <Text 
              style={[
                styles.roleDescription,
                selectedRole === 'client' && styles.selectedRoleText,
              ]}
            >
              Discover designers and hire talent for your projects
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  heading: {
    ...TYPOGRAPHY.heading,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: 40,
    color: COLORS.darkGray,
  },
  roleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 40,
  },
  roleCard: {
    width: '45%',
    minWidth: 200,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  selectedRoleCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleTitle: {
    ...TYPOGRAPHY.subheading,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  selectedRoleText: {
    color: COLORS.white,
  },
  continueButton: {
    width: '100%',
    maxWidth: 300,
  },
});