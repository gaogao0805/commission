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

  const color = type === 'success' ? '#059669' : '#6366f1';
  const borderColor = type === 'success' ? 'rgba(5,150,105,0.3)' : 'rgba(99,102,241,0.3)';

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
