import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'search..',
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Search size={20} color={COLORS.darkGray} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.darkGray}
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <X size={18} color={COLORS.darkGray} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.black,
  },
  clearButton: {
    padding: 8,
  },
});