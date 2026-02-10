// ============================================================
// Firestore Service - Posts, Comments, Collections
// ============================================================
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Post, Comment, PostCategory, PostUser, Collection } from '../types';

// ============================
// POST FUNCTIONS
// ============================

export const createPost = async (
  userId: string,
  postData: {
    title: string;
    description: string;
    images: string[]; // local URIs to upload
    tags: string[];
    category: PostCategory;
    software: string[];
    visibility: 'public' | 'followers' | 'private';
  },
  userInfo: PostUser
): Promise<string> => {
  // Upload images to Firebase Storage
  const imageUrls: string[] = [];
  for (let i = 0; i < postData.images.length; i++) {
    const uri = postData.images[i];
    if (uri.startsWith('http')) {
      imageUrls.push(uri);
      continue;
    }
    const ref = storage().ref(`posts/${userId}/${Date.now()}_${i}.jpg`);
    await ref.putFile(uri);
    const url = await ref.getDownloadURL();
    imageUrls.push(url);
  }

  const now = firestore.FieldValue.serverTimestamp();
  const docRef = await firestore().collection('posts').add({
    userId,
    user: userInfo,
    title: postData.title,
    description: postData.description,
    images: imageUrls,
    tags: postData.tags,
    category: postData.category,
    software: postData.software,
    visibility: postData.visibility,
    likesCount: 0,
    commentsCount: 0,
    savesCount: 0,
    sharesCount: 0,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  // Increment user post count
  await firestore().collection('users').doc(userId).update({
    postsCount: firestore.FieldValue.increment(1),
  });

  return docRef.id;
};

export const getPost = async (postId: string, currentUserId?: string): Promise<Post | null> => {
  const doc = await firestore().collection('posts').doc(postId).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  let isLiked = false;
  let isSaved = false;

  if (currentUserId) {
    const [likeDoc, saveDoc] = await Promise.all([
      firestore().collection('posts').doc(postId).collection('likes').doc(currentUserId).get(),
      firestore().collection('users').doc(currentUserId).collection('savedPosts').doc(postId).get(),
    ]);
    isLiked = likeDoc.exists;
    isSaved = saveDoc.exists;
  }

  return {
    id: doc.id,
    ...data,
    isLiked,
    isSaved,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Post;
};

export const getFeedPosts = async (
  feedType: 'forYou' | 'following' | 'trending' | 'fresh',
  currentUserId: string,
  category?: string,
  lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot,
  limit = 20
): Promise<{ posts: Post[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
  let query: FirebaseFirestoreTypes.Query = firestore()
    .collection('posts')
    .where('visibility', '==', 'public');

  if (category && category !== 'All') {
    query = query.where('category', '==', category);
  }

  switch (feedType) {
    case 'trending':
      query = query.orderBy('likesCount', 'desc');
      break;
    case 'fresh':
      query = query.orderBy('createdAt', 'desc');
      break;
    case 'following':
      // Get following list first
      const followingSnap = await firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('following')
        .get();
      const followingIds = followingSnap.docs.map(d => d.id);
      if (followingIds.length === 0) {
        return { posts: [], lastDoc: null };
      }
      // Firestore 'in' supports max 30 items
      const chunk = followingIds.slice(0, 30);
      query = firestore()
        .collection('posts')
        .where('userId', 'in', chunk)
        .orderBy('createdAt', 'desc');
      break;
    default: // forYou
      query = query.orderBy('createdAt', 'desc');
      break;
  }

  query = query.limit(limit);
  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const posts: Post[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    // Check like/save status
    const [likeDoc, saveDoc] = await Promise.all([
      firestore().collection('posts').doc(doc.id).collection('likes').doc(currentUserId).get(),
      firestore().collection('users').doc(currentUserId).collection('savedPosts').doc(doc.id).get(),
    ]);

    posts.push({
      id: doc.id,
      ...data,
      isLiked: likeDoc.exists,
      isSaved: saveDoc.exists,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Post);
  }

  return {
    posts,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};

export const getUserPosts = async (userId: string, currentUserId?: string): Promise<Post[]> => {
  const snapshot = await firestore()
    .collection('posts')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  const posts: Post[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    let isLiked = false;
    let isSaved = false;
    if (currentUserId) {
      const [likeDoc, saveDoc] = await Promise.all([
        firestore().collection('posts').doc(doc.id).collection('likes').doc(currentUserId).get(),
        firestore().collection('users').doc(currentUserId).collection('savedPosts').doc(doc.id).get(),
      ]);
      isLiked = likeDoc.exists;
      isSaved = saveDoc.exists;
    }
    posts.push({
      id: doc.id,
      ...data,
      isLiked,
      isSaved,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Post);
  }
  return posts;
};

export const deletePost = async (postId: string, userId: string): Promise<void> => {
  // Delete post images from storage
  const post = await getPost(postId);
  if (post) {
    for (const url of post.images) {
      try {
        const ref = storage().refFromURL(url);
        await ref.delete();
      } catch {}
    }
  }

  await firestore().collection('posts').doc(postId).delete();
  await firestore().collection('users').doc(userId).update({
    postsCount: firestore.FieldValue.increment(-1),
  });
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  const batch = firestore().batch();
  batch.set(
    firestore().collection('posts').doc(postId).collection('likes').doc(userId),
    { likedAt: firestore.FieldValue.serverTimestamp() }
  );
  batch.update(firestore().collection('posts').doc(postId), {
    likesCount: firestore.FieldValue.increment(1),
  });
  await batch.commit();
};

export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  const batch = firestore().batch();
  batch.delete(
    firestore().collection('posts').doc(postId).collection('likes').doc(userId)
  );
  batch.update(firestore().collection('posts').doc(postId), {
    likesCount: firestore.FieldValue.increment(-1),
  });
  await batch.commit();
};

export const savePost = async (postId: string, userId: string): Promise<void> => {
  const batch = firestore().batch();
  batch.set(
    firestore().collection('users').doc(userId).collection('savedPosts').doc(postId),
    { savedAt: firestore.FieldValue.serverTimestamp() }
  );
  batch.update(firestore().collection('posts').doc(postId), {
    savesCount: firestore.FieldValue.increment(1),
  });
  await batch.commit();
};

export const unsavePost = async (postId: string, userId: string): Promise<void> => {
  const batch = firestore().batch();
  batch.delete(
    firestore().collection('users').doc(userId).collection('savedPosts').doc(postId)
  );
  batch.update(firestore().collection('posts').doc(postId), {
    savesCount: firestore.FieldValue.increment(-1),
  });
  await batch.commit();
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  const q = query.toLowerCase();
  // Search by tags (Firestore array-contains)
  const tagSnapshot = await firestore()
    .collection('posts')
    .where('tags', 'array-contains', q)
    .where('visibility', '==', 'public')
    .limit(20)
    .get();

  // Search by title prefix
  const titleSnapshot = await firestore()
    .collection('posts')
    .where('visibility', '==', 'public')
    .orderBy('title')
    .startAt(query)
    .endAt(query + '\uf8ff')
    .limit(20)
    .get();

  const postsMap = new Map<string, Post>();
  const allDocs = [...tagSnapshot.docs, ...titleSnapshot.docs];

  for (const doc of allDocs) {
    if (!postsMap.has(doc.id)) {
      const data = doc.data();
      postsMap.set(doc.id, {
        id: doc.id,
        ...data,
        isLiked: false,
        isSaved: false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Post);
    }
  }

  return Array.from(postsMap.values());
};

// ============================
// COMMENT FUNCTIONS
// ============================

export const getComments = async (postId: string, currentUserId?: string): Promise<Comment[]> => {
  const snapshot = await firestore()
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .orderBy('createdAt', 'desc')
    .get();

  const comments: Comment[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    let isLiked = false;
    if (currentUserId) {
      const likeDoc = await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .doc(doc.id)
        .collection('likes')
        .doc(currentUserId)
        .get();
      isLiked = likeDoc.exists;
    }
    comments.push({
      id: doc.id,
      ...data,
      isLiked,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Comment);
  }
  return comments;
};

export const addComment = async (
  postId: string,
  userId: string,
  userInfo: PostUser,
  text: string,
  parentId?: string
): Promise<string> => {
  const docRef = await firestore()
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .add({
      postId,
      userId,
      user: userInfo,
      text,
      likesCount: 0,
      parentId: parentId || null,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

  await firestore().collection('posts').doc(postId).update({
    commentsCount: firestore.FieldValue.increment(1),
  });

  return docRef.id;
};

export const likeComment = async (
  postId: string,
  commentId: string,
  userId: string,
  isCurrentlyLiked: boolean
): Promise<void> => {
  const commentRef = firestore()
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .doc(commentId);

  if (isCurrentlyLiked) {
    await commentRef.collection('likes').doc(userId).delete();
    await commentRef.update({ likesCount: firestore.FieldValue.increment(-1) });
  } else {
    await commentRef.collection('likes').doc(userId).set({
      likedAt: firestore.FieldValue.serverTimestamp(),
    });
    await commentRef.update({ likesCount: firestore.FieldValue.increment(1) });
  }
};

// ============================
// UPLOAD HELPER
// ============================

export const uploadImage = async (
  uri: string,
  path: string
): Promise<string> => {
  const ref = storage().ref(path);
  await ref.putFile(uri);
  return ref.getDownloadURL();
};

export const uploadAvatar = async (uid: string, uri: string): Promise<string> => {
  return uploadImage(uri, `avatars/${uid}/avatar_${Date.now()}.jpg`);
};

export const uploadCoverPhoto = async (uid: string, uri: string): Promise<string> => {
  return uploadImage(uri, `covers/${uid}/cover_${Date.now()}.jpg`);
};
