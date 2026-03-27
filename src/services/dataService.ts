import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    serverTimestamp, 
    where,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    arrayUnion,
    arrayRemove,
    increment
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './firebaseConfig';
  
  export const subscribeToPosts = (callback: (posts: any[]) => void) => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
  };
  
  export const subscribeToUserPosts = (userId: string, callback: (posts: any[]) => void) => {
    const q = query(
      collection(db, 'posts'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
  };
  
  export const subscribeToMessages = (userId: string, callback: (messages: any[]) => void) => {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  };
  
  export const subscribeToActivity = (userId: string, callback: (activity: any[]) => void) => {
    const q = query(
      collection(db, 'activity'),
      where('targetUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const activity = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(activity);
    });
  };
  
  export const getTrendingPosts = async () => {
    const q = query(collection(db, 'posts'), orderBy('likes', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  export const uploadImageAsync = async (uri: string, path: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, path);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (e) {
      console.error("Image upload failed", e);
      throw e;
    }
  };

  export const createPost = async (userId: string, userName: string, title: string, description: string, imageUri: string, category: string) => {
    let postImageUrl = 'https://picsum.photos/id/1/800/800'; // Default
    
    // Upload image if provided
    if (imageUri && !imageUri.startsWith('http')) {
       postImageUrl = await uploadImageAsync(imageUri, `posts/${userId}/${Date.now()}`);
    } else if (imageUri) {
       postImageUrl = imageUri;
    }

    await addDoc(collection(db, 'posts'), {
      userId,
      author: userName,
      authorImage: `https://avatar.vercel.sh/${userName}`,
      title,
      description,
      postImage: postImageUrl,
      category,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
    });
  };
  
  export const toggleLike = async (postId: string, userId: string) => {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likedBy = postData.likedBy || [];
      const isLiked = likedBy.includes(userId);
      
      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likes: increment(-1)
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
          likes: increment(1)
        });

        // Add to activity feed if it's not the user's own post
        if (postData.userId !== userId) {
            await addDoc(collection(db, 'activity'), {
                targetUserId: postData.userId,
                userId: userId,
                user: 'Someone', // Real app should fetch user name
                action: 'liked your post',
                time: 'just now',
                avatar: `https://avatar.vercel.sh/${userId}`,
                type: 'like',
                postPreview: postData.postImage,
                createdAt: serverTimestamp()
            });
        }
      }
    }
  };

  export const updateProfile = async (userId: string, data: any) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  };
