import { COLORS } from '@/constants/colors';
import { Slider } from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import * as ImageManipulator from 'expo-image-manipulator';
import { Crop, Edit2, RotateCcw, Wand2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOOLBAR_HEIGHT = 60;
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface ImageEditorProps {
  imageUri: string;
  onSave: (editedImageUri: string) => void;
  onCancel: () => void;
}

export const ImageEditor = ({ imageUri, onSave, onCancel }: ImageEditorProps) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [editingMode, setEditingMode] = useState<'none' | 'crop' | 'adjust'>('none');
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  });

  // Animated values for pan and pinch
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Load image dimensions
  React.useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      const aspectRatio = width / height;
      const calculatedHeight = SCREEN_WIDTH / aspectRatio;
      setImageSize({ width: SCREEN_WIDTH, height: calculatedHeight });
    });
  }, [imageUri]);

  // Pan gesture handler
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  // Pinch gesture handler
  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
    },
    onEnd: () => {
      savedScale.value = scale.value;
    },
  });

  // Animated style for the image
  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Apply adjustments to image
  const applyAdjustments = async () => {
    try {
      const actions: ImageManipulator.Action[] = [];
      
      if (adjustments.brightness !== 0) {
        actions.push({ brightness: adjustments.brightness / 100 });
      }
      if (adjustments.contrast !== 0) {
        actions.push({ contrast: 1 + (adjustments.contrast / 100) });
      }
      if (adjustments.saturation !== 0) {
        actions.push({ saturate: 1 + (adjustments.saturation / 100) });
      }

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        actions,
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      onSave(result.uri);
    } catch (error) {
      console.error('Error applying adjustments:', error);
    }
  };

  const renderToolbar = () => (
    <BlurView intensity={80} tint="dark" style={styles.toolbar}>
      <TouchableOpacity 
        style={styles.toolButton} 
        onPress={() => setEditingMode('crop')}
      >
        <Crop color={COLORS.white} size={24} />
        <Text style={styles.toolText}>Crop</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toolButton}
        onPress={() => setEditingMode('adjust')}
      >
        <Edit2 color={COLORS.white} size={24} />
        <Text style={styles.toolText}>Adjust</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toolButton}
        onPress={() => {
          // Reset transformations
          scale.value = withSpring(1);
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          setAdjustments({ brightness: 0, contrast: 0, saturation: 0 });
        }}
      >
        <RotateCcw color={COLORS.white} size={24} />
        <Text style={styles.toolText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.toolButton, { opacity: 0.5 }]}
        onPress={() => {
          // This would integrate with AI features
          // For now it's disabled
        }}
      >
        <Wand2 color={COLORS.white} size={24} />
        <Text style={styles.toolText}>AI Edit</Text>
      </TouchableOpacity>
    </BlurView>
  );

  const renderAdjustmentControls = () => (
    <BlurView intensity={80} tint="dark" style={styles.adjustmentPanel}>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Brightness</Text>
        <Slider
          style={styles.slider}
          minimumValue={-100}
          maximumValue={100}
          value={adjustments.brightness}
          onValueChange={(value) => setAdjustments(prev => ({ ...prev, brightness: value }))}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.white}
          thumbTintColor={COLORS.primary}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Contrast</Text>
        <Slider
          style={styles.slider}
          minimumValue={-100}
          maximumValue={100}
          value={adjustments.contrast}
          onValueChange={(value) => setAdjustments(prev => ({ ...prev, contrast: value }))}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.white}
          thumbTintColor={COLORS.primary}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Saturation</Text>
        <Slider
          style={styles.slider}
          minimumValue={-100}
          maximumValue={100}
          value={adjustments.saturation}
          onValueChange={(value) => setAdjustments(prev => ({ ...prev, saturation: value }))}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.white}
          thumbTintColor={COLORS.primary}
        />
      </View>

      <TouchableOpacity 
        style={styles.applyButton}
        onPress={applyAdjustments}
      >
        <Text style={styles.applyButtonText}>Apply Changes</Text>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <PinchGestureHandler
        onGestureEvent={pinchGestureHandler}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            savedScale.value = scale.value;
          }
        }}
      >
        <Animated.View>
          <PanGestureHandler
            onGestureEvent={panGestureHandler}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) {
                savedTranslateX.value = translateX.value;
                savedTranslateY.value = translateY.value;
              }
            }}
          >
            <Animated.View>
              <AnimatedImage
                source={{ uri: imageUri }}
                style={[
                  {
                    width: imageSize.width,
                    height: imageSize.height,
                  },
                  imageStyle,
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {renderToolbar()}
      {editingMode === 'adjust' && renderAdjustmentControls()}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={applyAdjustments}
        >
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TOOLBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toolButton: {
    alignItems: 'center',
  },
  toolText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
  adjustmentPanel: {
    position: 'absolute',
    bottom: TOOLBAR_HEIGHT,
    left: 0,
    right: 0,
    padding: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    color: COLORS.white,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  actionButtons: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
