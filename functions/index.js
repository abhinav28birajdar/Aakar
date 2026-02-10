// ============================================================
// Firebase Cloud Functions - FCM Push Notifications
// ============================================================
// Deploy: cd functions && npm install && firebase deploy --only functions
//
// These Cloud Functions automatically send push notifications
// when events happen in Firestore (likes, comments, follows, messages).
// ============================================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// ---- Helper: Send push notification ----
async function sendPushNotification(userId, title, body, data = {}) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return;

    const fcmTokens = userDoc.data().fcmTokens || [];
    if (fcmTokens.length === 0) return;

    const message = {
      notification: { title, body },
      data: {
        ...data,
        type: data.type || 'system',
        userId: userId,
      },
      tokens: fcmTokens,
    };

    const response = await messaging.sendEachForMulticast(message);

    // Clean up invalid tokens
    const tokensToRemove = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;
        if (
          errorCode === 'messaging/invalid-registration-token' ||
          errorCode === 'messaging/registration-token-not-registered'
        ) {
          tokensToRemove.push(fcmTokens[idx]);
        }
      }
    });

    if (tokensToRemove.length > 0) {
      await db.collection('users').doc(userId).update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...tokensToRemove),
      });
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// ---- On New Like ----
exports.onPostLike = functions.firestore
  .document('posts/{postId}/likes/{userId}')
  .onCreate(async (snap, context) => {
    const { postId, userId: likerId } = context.params;

    const postDoc = await db.collection('posts').doc(postId).get();
    if (!postDoc.exists) return;

    const post = postDoc.data();
    const postOwnerId = post.userId;

    // Don't notify yourself
    if (likerId === postOwnerId) return;

    const likerDoc = await db.collection('users').doc(likerId).get();
    const likerName = likerDoc.exists ? likerDoc.data().displayName : 'Someone';

    // Create notification in Firestore
    await db.collection('notifications').add({
      type: 'like',
      title: 'New Like',
      body: `${likerName} liked your post "${post.title}"`,
      userId: postOwnerId,
      actorId: likerId,
      actor: {
        id: likerId,
        displayName: likerDoc.data().displayName,
        username: likerDoc.data().username,
        avatar: likerDoc.data().avatar || '',
        isVerified: likerDoc.data().isVerified || false,
      },
      postId: postId,
      postImage: post.images?.[0] || null,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send push notification
    await sendPushNotification(
      postOwnerId,
      'New Like ❤️',
      `${likerName} liked your post "${post.title}"`,
      { type: 'like', postId, actorId: likerId, channelId: 'social' }
    );
  });

// ---- On New Comment ----
exports.onNewComment = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snap, context) => {
    const { postId } = context.params;
    const comment = snap.data();
    const commenterId = comment.userId;

    const postDoc = await db.collection('posts').doc(postId).get();
    if (!postDoc.exists) return;

    const post = postDoc.data();
    const postOwnerId = post.userId;

    if (commenterId === postOwnerId) return;

    const commenterName = comment.user?.displayName || 'Someone';

    await db.collection('notifications').add({
      type: 'comment',
      title: 'New Comment',
      body: `${commenterName} commented on your post: "${comment.text.substring(0, 50)}"`,
      userId: postOwnerId,
      actorId: commenterId,
      actor: comment.user,
      postId: postId,
      postImage: post.images?.[0] || null,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendPushNotification(
      postOwnerId,
      'New Comment 💬',
      `${commenterName}: "${comment.text.substring(0, 80)}"`,
      { type: 'comment', postId, actorId: commenterId, channelId: 'social' }
    );
  });

// ---- On New Follow ----
exports.onNewFollow = functions.firestore
  .document('users/{userId}/followers/{followerId}')
  .onCreate(async (snap, context) => {
    const { userId, followerId } = context.params;

    if (followerId === userId) return;

    const followerDoc = await db.collection('users').doc(followerId).get();
    if (!followerDoc.exists) return;

    const followerName = followerDoc.data().displayName;

    await db.collection('notifications').add({
      type: 'follow',
      title: 'New Follower',
      body: `${followerName} started following you`,
      userId: userId,
      actorId: followerId,
      actor: {
        id: followerId,
        displayName: followerDoc.data().displayName,
        username: followerDoc.data().username,
        avatar: followerDoc.data().avatar || '',
        isVerified: followerDoc.data().isVerified || false,
      },
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendPushNotification(
      userId,
      'New Follower 👋',
      `${followerName} started following you`,
      { type: 'follow', actorId: followerId, channelId: 'social' }
    );
  });

// ---- On New Message ----
exports.onNewMessage = functions.firestore
  .document('chatRooms/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const { chatId } = context.params;
    const message = snap.data();
    const senderId = message.senderId;

    const chatDoc = await db.collection('chatRooms').doc(chatId).get();
    if (!chatDoc.exists) return;

    const chat = chatDoc.data();
    const participantIds = chat.participantIds || [];

    const senderDoc = await db.collection('users').doc(senderId).get();
    const senderName = senderDoc.exists ? senderDoc.data().displayName : 'Someone';

    const messagePreview = message.text
      ? message.text.substring(0, 80)
      : message.image
      ? '📷 Photo'
      : 'New message';

    for (const participantId of participantIds) {
      if (participantId === senderId) continue;

      // Check if chat is muted for this user
      if (chat.mutedBy?.includes(participantId)) continue;

      await sendPushNotification(
        participantId,
        chat.isGroup ? `${chat.groupName || 'Group'}: ${senderName}` : senderName,
        messagePreview,
        {
          type: 'message',
          chatId,
          actorId: senderId,
          channelId: 'messages',
        }
      );
    }
  });

module.exports = exports;
