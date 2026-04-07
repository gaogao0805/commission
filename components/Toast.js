import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export default function Toast({ message, type, visible, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: false }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: false }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: false }),
          Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: false }),
        ]).start(() => onHide?.());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!visible) return null;

  const colorMap = {
    success: '#02A87E', pass: '#02A87E',
    pending: '#E19D16',
    reject: '#dc2626',
    info: '#6366f1',
  };
  const color = colorMap[type] || '#6366f1';
  const borderColor = color + '4D';

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }], borderColor }]}>
      <Text style={[styles.text, { color }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 60, alignSelf: 'center', zIndex: 999,
    backgroundColor: '#f0f0f5', borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8,
  },
  text: { fontSize: 13, fontWeight: '500' },
});
