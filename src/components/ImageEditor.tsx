import { COLORS } from '@/constants/colors';
import Slider from '@react-native-community/slider';
import * as ImageManipulator from 'expo-image-manipulator';
import { Crop, Edit2, RotateCcw, Wand2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageEditorProps {
  imageUri: string;
  onSave: (editedImageUri: string) => void;
  onCancel: () => void;
}

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUri,
  onSave,
  onCancel,
}) => {
  const [adjustments, setAdjustments] = useState<Adjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
  });
  const [activeAdjustment, setActiveAdjustment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async () => {
    setIsProcessing(true);
    try {
      const actions: ImageManipulator.Action[] = [];

      // Add rotation if needed
      if (adjustments.rotation !== 0) {
        actions.push({ rotate: adjustments.rotation });
      }

      // Note: expo-image-manipulator doesn't support brightness, contrast, saturation
      // These would need to be implemented with a different library or custom solution
      // In SDK 54, we need to handle the format a bit differently
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        actions,
        { compress: 0.8, format: 'jpeg' }
      );

      onSave(result.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
    });
    setActiveAdjustment(null);
  };

  const rotateImage = () => {
    setAdjustments(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={[
            styles.image,
            { transform: [{ rotate: `${adjustments.rotation}deg` }] }
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Adjustment Controls */}
      {activeAdjustment && (
        <View style={styles.sliderContainer}>
          <Text style={styles.adjustmentLabel}>
            {activeAdjustment.charAt(0).toUpperCase() + activeAdjustment.slice(1)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={-100}
            maximumValue={100}
            value={adjustments[activeAdjustment as keyof Adjustments] as number}
            onValueChange={(value: number) => 
              setAdjustments(prev => ({ ...prev, [activeAdjustment]: value }))
            }
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
          />
        </View>
      )}

      {/* Tool Buttons */}
      <View style={styles.toolsContainer}>
        <TouchableOpacity 
          style={[
            styles.toolButton,
            activeAdjustment === 'brightness' && styles.activeToolButton
          ]}
          onPress={() => setActiveAdjustment(
            activeAdjustment === 'brightness' ? null : 'brightness'
          )}
        >
          <Wand2 size={24} color={COLORS.white} />
          <Text style={styles.toolText}>Brightness</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.toolButton,
            activeAdjustment === 'contrast' && styles.activeToolButton
          ]}
          onPress={() => setActiveAdjustment(
            activeAdjustment === 'contrast' ? null : 'contrast'
          )}
        >
          <Edit2 size={24} color={COLORS.white} />
          <Text style={styles.toolText}>Contrast</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toolButton}
          onPress={rotateImage}
        >
          <RotateCcw size={24} color={COLORS.white} />
          <Text style={styles.toolText}>Rotate</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.toolButton,
            activeAdjustment === 'saturation' && styles.activeToolButton
          ]}
          onPress={() => setActiveAdjustment(
            activeAdjustment === 'saturation' ? null : 'saturation'
          )}
        >
          <Crop size={24} color={COLORS.white} />
          <Text style={styles.toolText}>Saturation</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.resetButton]}
          onPress={resetAdjustments}
        >
          <Text style={styles.actionText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={processImage}
          disabled={isProcessing}
        >
          <Text style={styles.actionText}>
            {isProcessing ? 'Processing...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sliderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  adjustmentLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  toolButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  activeToolButton: {
    backgroundColor: COLORS.primary,
  },
  toolText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.darkGray,
  },
  resetButton: {
    backgroundColor: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 16,
  },
});
