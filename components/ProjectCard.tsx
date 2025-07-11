import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (CARD_MARGIN * 6)) / 2;

interface ProjectCardProps {
  id: string;
  title: string;
  designer: string;
  imageUrl: string;
  isSaved?: boolean;
  onPress: () => void;
  onSaveToggle?: () => void;
  backgroundColor?: string;
  aspectRatio?: number;
}

export const ProjectCard = ({
  title,
  designer,
  imageUrl,
  isSaved = false,
  onPress,
  onSaveToggle,
  backgroundColor = COLORS.cardColors.green,
  aspectRatio = 1.2,
}: ProjectCardProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor, height: CARD_WIDTH * aspectRatio }
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}
      
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.designer} numberOfLines={1}>by {designer}</Text>
        </View>
        
        {onSaveToggle && (
          <TouchableOpacity 
            style={styles.heartButton} 
            onPress={onSaveToggle}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Heart 
              size={20} 
              color={isSaved ? COLORS.primary : COLORS.white} 
              fill={isSaved ? COLORS.primary : 'none'} 
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.black,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    ...TYPOGRAPHY.subheading,
    color: COLORS.white,
    marginBottom: 2,
  },
  designer: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
  },
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});