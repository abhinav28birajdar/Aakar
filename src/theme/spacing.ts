import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SIZES = {
    width,
    height,
    // Spacing
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,

    // Border Radius
    radXs: 4,
    radSm: 8,
    radMd: 12,
    radLg: 16,
    radXl: 24,
    radFull: 9999,
};
