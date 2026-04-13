import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function GlowBorder({ height = 92, borderRadius = 12, borderWidth = 1, duration = 8000, children }) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 32;

  const straight = 2 * (cardWidth - 2 * borderRadius) + 2 * (height - 2 * borderRadius);
  const curved = 2 * Math.PI * borderRadius;
  const perimeter = straight + curved;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const dashOffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -perimeter],
  });

  return (
    <View style={styles.wrap}>
      <Svg width={cardWidth} height={height} style={StyleSheet.absoluteFill}>
        {/* Fade edge — longest, faintest */}
        <AnimatedRect
          x={0.5} y={0.5} width={cardWidth - 1} height={height - 1}
          rx={borderRadius} ry={borderRadius}
          fill="none" stroke="rgba(223,148,14,0.1)" strokeWidth={1}
          strokeDasharray={`${perimeter * 0.5} ${perimeter * 0.5}`}
          strokeDashoffset={dashOffset} strokeLinecap="round"
        />
        {/* Mid — medium */}
        <AnimatedRect
          x={0.5} y={0.5} width={cardWidth - 1} height={height - 1}
          rx={borderRadius} ry={borderRadius}
          fill="none" stroke="rgba(223,148,14,0.4)" strokeWidth={1}
          strokeDasharray={`${perimeter * 0.3} ${perimeter * 0.7}`}
          strokeDashoffset={dashOffset} strokeLinecap="round"
        />
        {/* Core — shortest, brightest */}
        <AnimatedRect
          x={0.5} y={0.5} width={cardWidth - 1} height={height - 1}
          rx={borderRadius} ry={borderRadius}
          fill="none" stroke="#DF940E" strokeWidth={1}
          strokeDasharray={`${perimeter * 0.1} ${perimeter * 0.9}`}
          strokeDashoffset={dashOffset} strokeLinecap="round"
        />
      </Svg>
      <View style={[styles.card, { borderRadius, margin: borderWidth }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, position: 'relative' },
  card: { flex: 1, backgroundColor: '#fff' },
});
