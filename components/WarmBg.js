import React, { useRef } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';

const DOTS = [
  { x: 62, y: 127.5, r: 3.5, op: 0.5 },
  { x: 107, y: 129.5, r: 3, op: 0.45 },
  { x: 17.6, y: 96, r: 2.5, op: 0.4 },
  { x: 45.2, y: 36.6, r: 2.5, op: 0.4 },
  { x: 126.2, y: 69.6, r: 2.5, op: 0.4 },
  { x: 170.2, y: 89.6, r: 2.2, op: 0.35 },
  { x: 362, y: 125.4, r: 4, op: 0.5 },
  { x: 347.5, y: 105.9, r: 3.5, op: 0.45 },
  { x: 242.2, y: 72.6, r: 2, op: 0.35 },
  { x: 188.8, y: 21.2, r: 2.8, op: 0.4 },
  { x: 215.5, y: 12.9, r: 2, op: 0.35 },
  { x: 303.8, y: 9.2, r: 4.5, op: 0.5 },
  { x: 362.2, y: 99.6, r: 2.2, op: 0.35 },
  { x: 30, y: 60, r: 2, op: 0.35 },
  { x: 145, y: 45, r: 3, op: 0.4 },
  { x: 200, y: 110, r: 2.5, op: 0.38 },
  { x: 290, y: 140, r: 3.2, op: 0.42 },
  { x: 75, y: 160, r: 2.8, op: 0.4 },
  { x: 320, y: 160, r: 3, op: 0.38 },
  { x: 270, y: 95, r: 1.8, op: 0.3 },
  { x: 350, y: 25, r: 2.5, op: 0.36 },
];

let _idCounter = 0;

export default function WarmBg() {
  const { width } = useWindowDimensions();
  const bgH = width * 275 / 375;
  const gradId = useRef(`warmBgGrad_${++_idCounter}`).current;

  return (
    <View style={[styles.warmBg, { height: bgH }]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 375 275" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={gradId} x1="169" y1="0" x2="190.686" y2="245.262" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#FFE9D5" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect width="375" height="275" fill={`url(#${gradId})`} />
        {DOTS.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#F6D9B9" opacity={d.op} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  warmBg: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%', zIndex: 0 },
});
