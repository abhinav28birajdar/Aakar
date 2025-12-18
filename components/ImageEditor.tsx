import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    View,
} from 'react-native';

interface ImageEditorProps {
  imageUri: string;
  onSave: (imageUri: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ imageUri, onSave, onCancel }: ImageEditorProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Initialize PanResponder with gesture handlers
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Set offset when the gesture starts
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // Update position as the gesture moves
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        // When the gesture ends, keep the offset
        pan.flattenOffset();
      },
    })
  ).current;

  // Reset transforms
  const handleReset = () => {
    Animated.parallel([
      Animated.spring(pan.x, { toValue: 0, useNativeDriver: true }),
      Animated.spring(pan.y, { toValue: 0, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(rotation, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  // Rotate image
  const handleRotate = () => {
    Animated.timing(rotation, {
      toValue: (rotation as any)._value + 90,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  // Apply current transforms to save
  const handleSave = () => {
    // TODO: Apply transforms to image before saving
    onSave(imageUri);
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale },
                {
                  rotate: rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLoad={(e) => {
              const { width, height } = e.nativeEvent.source;
              setImageSize({ width, height });
            }}
          />
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button 
          onPress={handleReset} 
          title="Reset"
          icon={<Icon name="refresh-ccw" size={20} className="text-white" />}
        />
        <Button 
          onPress={handleRotate}
          title="Rotate"
          icon={<Icon name="rotate-ccw" size={20} className="text-white" />}
        />
        <Button 
          onPress={onCancel} 
          variant="outline"
          title="Cancel"
          icon={<Icon name="x" size={20} className="text-primary" />}
        />
        <Button 
          onPress={handleSave}
          title="Save"
          icon={<Icon name="check" size={20} className="text-white" />}
        />
      </View>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#000',
  },
});
