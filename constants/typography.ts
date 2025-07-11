import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const TYPOGRAPHY = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 16,
    color: COLORS.black,
  },
  caption: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
});