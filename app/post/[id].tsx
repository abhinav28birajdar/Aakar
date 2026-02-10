// ============================================================
// Post Detail Screen - post/[id].tsx
// ============================================================
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, FlatList, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Eye,
  Send, MoreHorizontal, Award,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { usePostStore } from '../../src/stores/postStore';
import { formatNumber, timeAgo, screenWidth } from '../../src/utils/helpers';
import { Comment } from '../../src/types';

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { getPostById, likePost, unlikePost, savePost, unsavePost, comments, loadComments, addComment, likeComment } = usePostStore();

  const post = getPostById(id);
  const postComments = comments[id] || [];
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) loadComments(id);
  }, [id]);

  if (!post) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>Post not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.goBack, { color: colors.primary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleLike = () => {
    if (post.isLiked) unlikePost(post.id);
    else likePost(post.id);
  };

  const handleSave = () => {
    if (post.isSaved) unsavePost(post.id);
    else savePost(post.id);
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    addComment(post.id, newComment.trim());
    setNewComment('');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/report', params: { targetId: post.id, targetType: 'post' } })}>
            <MoreHorizontal size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User */}
          <TouchableOpacity
            style={styles.userRow}
            onPress={() => router.push(`/profile/${post.user.username}`)}
          >
            <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: colors.text }]}>{post.user.displayName}</Text>
                {post.user.isVerified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                    <Award size={10} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={[styles.userTime, { color: colors.textMuted }]}>{timeAgo(post.createdAt)}</Text>
            </View>
          </TouchableOpacity>

          {/* Image Carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setCurrentImageIndex(Math.round(e.nativeEvent.contentOffset.x / screenWidth))}
          >
            {post.images.map((img, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.95}
                onPress={() => router.push({ pathname: '/modal/image-preview', params: { imageUrl: img } })}
              >
                <Image source={{ uri: img }} style={styles.postImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          {post.images.length > 1 && (
            <View style={styles.dotsRow}>
              {post.images.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentImageIndex && { backgroundColor: colors.primary, width: 20 }]} />
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
              <Heart size={24} color={post.isLiked ? '#FF6B6B' : colors.text} fill={post.isLiked ? '#FF6B6B' : 'none'} />
              <Text style={[styles.actionText, { color: post.isLiked ? '#FF6B6B' : colors.text }]}>{formatNumber(post.likesCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <MessageCircle size={24} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>{formatNumber(post.commentsCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
              <Bookmark size={24} color={post.isSaved ? colors.primary : colors.text} fill={post.isSaved ? colors.primary : 'none'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Share2 size={22} color={colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={styles.actionBtn}>
              <Eye size={20} color={colors.textMuted} />
              <Text style={[styles.actionText, { color: colors.textMuted }]}>{formatNumber(post.viewsCount)}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentSection}>
            <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
            {post.description ? (
              <Text style={[styles.postDesc, { color: colors.textSecondary }]}>{post.description}</Text>
            ) : null}

            {/* Tags */}
            {post.tags.length > 0 && (
              <View style={styles.tagRow}>
                {post.tags.map(tag => (
                  <TouchableOpacity key={tag} style={[styles.tagChip, { backgroundColor: colors.primary + '15' }]}
                    onPress={() => router.push(`/category/${tag}`)}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Details */}
            <View style={[styles.metaCard, { backgroundColor: colors.surface }]}>
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Category</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{post.category}</Text>
              </View>
              {post.software.length > 0 && (
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Software</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>{post.software.join(', ')}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Comments */}
          <View style={styles.commentsSection}>
            <Text style={[styles.commentHeader, { color: colors.text }]}>Comments ({postComments.length})</Text>
            {postComments.map(comment => (
              <View key={comment.id} style={[styles.commentRow, { borderBottomColor: colors.border }]}>
                <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.commentTop}>
                    <Text style={[styles.commentName, { color: colors.text }]}>{comment.user.displayName}</Text>
                    <Text style={[styles.commentTime, { color: colors.textMuted }]}>{timeAgo(comment.createdAt)}</Text>
                  </View>
                  <Text style={[styles.commentText, { color: colors.textSecondary }]}>{comment.text}</Text>
                  <TouchableOpacity style={styles.commentLike} onPress={() => likeComment(comment.id)}>
                    <Heart size={14} color={comment.isLiked ? '#FF6B6B' : colors.textMuted} fill={comment.isLiked ? '#FF6B6B' : 'none'} />
                    <Text style={[styles.commentLikeCount, { color: colors.textMuted }]}>{comment.likesCount}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.commentInputRow, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.commentInput, { color: colors.text, backgroundColor: colors.surface }]}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textMuted}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity onPress={handleSendComment} disabled={!newComment.trim()}>
            <Send size={22} color={newComment.trim() ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: '700' },
  goBack: { fontSize: 15, fontWeight: '700' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 16, fontWeight: '700' },
  verifiedBadge: { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  userTime: { fontSize: 12, marginTop: 2 },
  postImage: { width: screenWidth, height: screenWidth, backgroundColor: '#f0f0f0' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 4, paddingVertical: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 14, fontWeight: '700' },
  contentSection: { paddingHorizontal: 20 },
  postTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8, lineHeight: 28 },
  postDesc: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontSize: 13, fontWeight: '600' },
  metaCard: { padding: 16, borderRadius: 14, marginBottom: 20, gap: 10 },
  metaItem: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontSize: 13 },
  metaValue: { fontSize: 13, fontWeight: '600' },
  commentsSection: { paddingHorizontal: 20 },
  commentHeader: { fontSize: 17, fontWeight: '800', marginBottom: 16 },
  commentRow: { flexDirection: 'row', gap: 12, paddingBottom: 14, marginBottom: 14, borderBottomWidth: 0.5 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentName: { fontSize: 14, fontWeight: '700' },
  commentTime: { fontSize: 11 },
  commentText: { fontSize: 14, lineHeight: 20 },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  commentLikeCount: { fontSize: 12 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12, borderTopWidth: 0.5 },
  commentInput: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 80 },
});
