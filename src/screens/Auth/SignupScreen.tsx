import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { Lock, Mail, ChevronLeft, User } from 'lucide-react-native';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<any>();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      
      // Store user data in Firestore with proper timestamp
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        bio: 'Product Designer & Coffee Enthusiast. Creating digital experiences that matter.',
        location: 'San Francisco, CA',
        website: 'ninja.design',
        createdAt: serverTimestamp(),
      });

    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 pt-12">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-10 w-12 h-12 bg-[#121212] rounded-2xl items-center justify-center border border-[#1A1A1A]">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>

          <View className="mb-14">
            <Text className="text-5xl font-black text-white mb-4 tracking-tighter">Join Aakar</Text>
            <Text className="text-xl text-gray-500 font-medium">Start sharing your creative journey with the world.</Text>
          </View>

          <View className="space-y-8">
            <View>
              <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Full Name</Text>
              <View className="flex-row items-center bg-[#121212] rounded-2xl px-6 py-5 border border-[#1A1A1A]">
                <User color="#818CF8" size={20} className="mr-4" />
                <TextInput 
                  placeholder="John Doe"
                  placeholderTextColor="#4A5568"
                  className="flex-1 text-white text-lg font-bold"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View className="mt-6">
              <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Email Address</Text>
              <View className="flex-row items-center bg-[#121212] rounded-2xl px-6 py-5 border border-[#1A1A1A]">
                <Mail color="#818CF8" size={20} className="mr-4" />
                <TextInput 
                  placeholder="name@example.com"
                  placeholderTextColor="#4A5568"
                  className="flex-1 text-white text-lg font-bold"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View className="mt-6">
              <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Password</Text>
              <View className="flex-row items-center bg-[#121212] rounded-2xl px-6 py-5 border border-[#1A1A1A]">
                <Lock color="#818CF8" size={20} className="mr-4" />
                <TextInput 
                  placeholder="••••••••"
                  placeholderTextColor="#4A5568"
                  className="flex-1 text-white text-lg font-bold"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {error ? <Text className="text-red-400 mt-6 ml-1 text-base font-bold italic">{error}</Text> : null}

          <TouchableOpacity 
            onPress={handleSignup}
            disabled={loading}
            className="bg-[#818CF8] py-6 rounded-[24px] mt-12 items-center justify-center shadow-2xl shadow-indigo-500"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-2xl font-black">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-12 pb-14">
            <Text className="text-gray-500 text-lg">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-[#818CF8] font-black text-lg">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
