import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { Lock, Mail, ChevronLeft } from 'lucide-react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
            <Text className="text-5xl font-black text-white mb-4 tracking-tighter">Welcome back</Text>
            <Text className="text-xl text-gray-500 font-medium">Continue your design journey with Aakar.</Text>
          </View>

          <View className="space-y-8">
            <View>
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
            onPress={handleLogin}
            disabled={loading}
            className="bg-[#818CF8] py-6 rounded-[24px] mt-12 items-center justify-center shadow-2xl shadow-indigo-500"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-2xl font-black">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-12 pb-14">
            <Text className="text-gray-500 text-lg">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-[#818CF8] font-black text-lg">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
