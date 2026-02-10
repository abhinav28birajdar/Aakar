// ============================================================
// Create Post Screen - Creator Studio
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Image, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera, ImageIcon, X, Plus, ChevronDown, Hash, Globe, Lock, Users,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { usePostStore } from '../../src/stores/postStore';
import { CATEGORIES, SOFTWARE_LIST, SKILL_TAGS } from '../../src/data/mockData';
import { PostCategory, PostVisibility } from '../../src/types';

const VISIBILITY_OPTIONS: { value: PostVisibility; label: string; icon: any }[] = [
  { value: 'public', label: 'Public', icon: Globe },
  { value: 'followers', label: 'Followers', icon: Users },
  { value: 'private', label: 'Private', icon: Lock },
];

export default function CreateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createPost } = usePostStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<PostCategory>('UI/UX');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [software, setSoftware] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showSoftwarePicker, setShowSoftwarePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });
      if (!result.canceled && result.assets) {
        setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 10));
      }
    } catch {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled && result.assets) {
        setImages(prev => [...prev, result.assets[0].uri].slice(0, 10));
      }
    } catch {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const addTag = () => {
    const t = tagInput.trim().replace('#', '');
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) return Alert.alert('Missing Title', 'Please add a title for your post');
    if (images.length === 0) return Alert.alert('No Images', 'Please add at least one image');

    setLoading(true);
    const result = await createPost({ title, description, images, tags, category, software, visibility });
    setLoading(false);
    if (result.success) {
      Alert.alert('Published!', 'Your post is now live', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to publish');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
        <TouchableOpacity onPress={handlePublish} disabled={loading}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.publishBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.publishText}>Publish</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Images */}
        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {images.map((uri, i) => (
              <View key={i} style={styles.imageWrap}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <TouchableOpacity style={styles.removeImg} onPress={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>
                  <X size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addImageBtns}>
              <TouchableOpacity style={[styles.addImageBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickImages}>
                <ImageIcon size={24} color={colors.primary} />
                <Text style={[styles.addImageText, { color: colors.textSecondary }]}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addImageBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={takePhoto}>
                <Camera size={24} color={colors.primary} />
                <Text style={[styles.addImageText, { color: colors.textSecondary }]}>Camera</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Text style={[styles.imageCount, { color: colors.textMuted }]}>{images.length}/10 images</Text>
        </View>

        {/* Title */}
        <TextInput
          style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
          placeholder="Give your design a title..."
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />

        {/* Description */}
        <TextInput
          style={[styles.descInput, { color: colors.text, backgroundColor: colors.surface }]}
          placeholder="Describe your design, process, inspiration..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={2000}
          textAlignVertical="top"
        />

        {/* Category */}
        <TouchableOpacity
          style={[styles.pickerRow, { borderColor: colors.border }]}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>Category</Text>
          <View style={styles.pickerRight}>
            <Text style={[styles.pickerValue, { color: colors.text }]}>{category}</Text>
            <ChevronDown size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
        {showCategoryPicker && (
          <View style={[styles.pickerDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.pickerOption, category === c && { backgroundColor: colors.primary + '15' }]}
                onPress={() => { setCategory(c as PostCategory); setShowCategoryPicker(false); }}
              >
                <Text style={[styles.pickerOptionText, { color: category === c ? colors.primary : colors.text }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tags */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Tags</Text>
          <View style={[styles.tagInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Hash size={16} color={colors.textMuted} />
            <TextInput
              style={[styles.tagInputField, { color: colors.text }]}
              placeholder="Add tags..."
              placeholderTextColor={colors.textMuted}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            {tagInput.length > 0 && (
              <TouchableOpacity onPress={addTag} style={[styles.addTagBtn, { backgroundColor: colors.primary }]}>
                <Plus size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tagList}>
            {tags.map(tag => (
              <View key={tag} style={[styles.tagChip, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.tagChipText, { color: colors.primary }]}>#{tag}</Text>
                <TouchableOpacity onPress={() => setTags(prev => prev.filter(t => t !== tag))}>
                  <X size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Software */}
        <TouchableOpacity
          style={[styles.pickerRow, { borderColor: colors.border }]}
          onPress={() => setShowSoftwarePicker(!showSoftwarePicker)}
        >
          <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>Software Used</Text>
          <View style={styles.pickerRight}>
            <Text style={[styles.pickerValue, { color: colors.text }]}>{software.length > 0 ? software.join(', ') : 'Select'}</Text>
            <ChevronDown size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
        {showSoftwarePicker && (
          <View style={[styles.pickerDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {SOFTWARE_LIST.map(s => {
              const selected = software.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.pickerOption, selected && { backgroundColor: colors.primary + '15' }]}
                  onPress={() => setSoftware(prev => selected ? prev.filter(x => x !== s) : [...prev, s])}
                >
                  <Text style={[styles.pickerOptionText, { color: selected ? colors.primary : colors.text }]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Visibility */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Visibility</Text>
          <View style={styles.visRow}>
            {VISIBILITY_OPTIONS.map(v => {
              const Icon = v.icon;
              const isActive = visibility === v.value;
              return (
                <TouchableOpacity
                  key={v.value}
                  style={[styles.visChip, { borderColor: isActive ? colors.primary : colors.border, backgroundColor: isActive ? colors.primary + '15' : 'transparent' }]}
                  onPress={() => setVisibility(v.value)}
                >
                  <Icon size={16} color={isActive ? colors.primary : colors.textMuted} />
                  <Text style={[styles.visText, { color: isActive ? colors.primary : colors.textSecondary }]}>{v.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  publishBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  publishText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  body: { paddingHorizontal: 16 },
  imageSection: { marginBottom: 20 },
  imageWrap: { position: 'relative' },
  imageThumb: { width: 100, height: 100, borderRadius: 12 },
  removeImg: { position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  addImageBtns: { flexDirection: 'row', gap: 8 },
  addImageBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 6 },
  addImageText: { fontSize: 11, fontWeight: '600' },
  imageCount: { fontSize: 12, marginTop: 8 },
  titleInput: { fontSize: 22, fontWeight: '800', paddingVertical: 14, borderBottomWidth: 1, marginBottom: 16 },
  descInput: { fontSize: 15, minHeight: 100, padding: 14, borderRadius: 12, marginBottom: 20, lineHeight: 22 },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  pickerLabel: { fontSize: 14, fontWeight: '600' },
  pickerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pickerValue: { fontSize: 14, fontWeight: '500' },
  pickerDropdown: { borderWidth: 1, borderRadius: 12, padding: 4, marginBottom: 12 },
  pickerOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  pickerOptionText: { fontSize: 14, fontWeight: '500' },
  section: { marginTop: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  tagInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44, gap: 8 },
  tagInputField: { flex: 1, fontSize: 14, height: '100%' },
  addTagBtn: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  tagChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  tagChipText: { fontSize: 13, fontWeight: '600' },
  visRow: { flexDirection: 'row', gap: 10 },
  visChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  visText: { fontSize: 13, fontWeight: '600' },
});
