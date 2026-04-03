import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getResumeStatusLabel } from '../data/candidates';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80;
const SWIPE_DOWN_THRESHOLD = 100;

export default function SwipeCard({ candidate, isFront, behind, onSwipe, onRequestResume }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const passOpacity = useRef(new Animated.Value(0)).current;
  const rejectOpacity = useRef(new Animated.Value(0)).current;
  const pendingOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isFront,
      onMoveShouldSetPanResponder: (_, g) => isFront && (Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5),
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: Math.max(0, gesture.dy) });
        passOpacity.setValue(Math.min(Math.max(gesture.dx / SWIPE_THRESHOLD, 0), 1));
        rejectOpacity.setValue(Math.min(Math.max(-gesture.dx / SWIPE_THRESHOLD, 0), 1));
        pendingOpacity.setValue(Math.min(Math.max(gesture.dy / SWIPE_DOWN_THRESHOLD, 0), 1) * Math.max(0, 1 - Math.abs(gesture.dx) / 200));
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          animateOut('pass', gesture);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          animateOut('reject', gesture);
        } else if (gesture.dy > SWIPE_DOWN_THRESHOLD && Math.abs(gesture.dx) < 50) {
          animateOut('pending', gesture);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          Animated.timing(passOpacity, { toValue: 0, duration: 200, useNativeDriver: false }).start();
          Animated.timing(rejectOpacity, { toValue: 0, duration: 200, useNativeDriver: false }).start();
          Animated.timing(pendingOpacity, { toValue: 0, duration: 200, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const animateOut = (decision) => {
    const toX = decision === 'pass' ? SCREEN_WIDTH * 1.5 : decision === 'reject' ? -SCREEN_WIDTH * 1.5 : 0;
    const toY = decision === 'pending' ? 800 : 0;
    Animated.timing(pan, { toValue: { x: toX, y: toY }, duration: 350, useNativeDriver: false }).start(() => {
      onSwipe?.(decision);
    });
  };

  // Expose animateOut for button triggers
  React.useImperativeHandle(candidate._ref, () => ({ animateOut }), []);

  const rotate = pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-15deg', '0deg', '15deg'] });
  const scale = isFront ? 1 : behind === 1 ? 0.95 : 0.9;
  const translateYOffset = isFront ? 0 : behind === 1 ? 12 : 24;
  const opacity = isFront ? 1 : behind === 1 ? 0.5 : 0.3;

  const c = candidate;
  const initial = c.name.charAt(0);
  const isMale = c.gender === 'male';
  const resumeLabel = getResumeStatusLabel(c);

  let resumeTagText, resumeTagColor, resumeTagBg;
  if (c.hasNewResume && !c.newResumeRead) {
    resumeTagText = '新简历'; resumeTagColor = '#059669'; resumeTagBg = 'rgba(5,150,105,0.08)';
  } else if (resumeLabel) {
    resumeTagText = resumeLabel.text;
    resumeTagColor = resumeLabel.type === 'new' ? '#059669' : resumeLabel.type === 'requested' ? '#3b82f6' : '#4f46e5';
    resumeTagBg = resumeLabel.type === 'new' ? 'rgba(5,150,105,0.08)' : resumeLabel.type === 'requested' ? 'rgba(59,130,246,0.08)' : 'rgba(99,102,241,0.08)';
  } else {
    resumeTagText = '暂无简历'; resumeTagColor = '#9ca3af'; resumeTagBg = 'rgba(0,0,0,0.04)';
  }

  return (
    <Animated.View
      style={[styles.card, {
        transform: isFront
          ? [{ translateX: pan.x }, { translateY: pan.y }, { rotate }]
          : [{ scale }, { translateY: translateYOffset }],
        opacity,
        zIndex: isFront ? 10 : behind === 1 ? 5 : 1,
      }]}
      {...(isFront ? panResponder.panHandlers : {})}
    >
      {/* Swipe indicators */}
      {isFront && (
        <>
          <Animated.View style={[styles.indicator, styles.passIndicator, { opacity: passOpacity }]}>
            <Text style={styles.passIndicatorText}>通过</Text>
          </Animated.View>
          <Animated.View style={[styles.indicator, styles.rejectIndicator, { opacity: rejectOpacity }]}>
            <Text style={styles.rejectIndicatorText}>拒绝</Text>
          </Animated.View>
          <Animated.View style={[styles.indicator, styles.pendingIndicator, { opacity: pendingOpacity }]}>
            <Text style={styles.pendingIndicatorText}>待定</Text>
          </Animated.View>
        </>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: isMale ? '#dbeafe' : '#f3e8ff' }]}>
            <Text style={[styles.avatarText, { color: isMale ? '#2563eb' : '#7c3aed' }]}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.title}>{c.title} · {c.company}</Text>
            <Text style={styles.exp}>{c.exp}经验 · {c.location}</Text>
          </View>
        </View>

        {/* AI Reason */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI 推荐理由</Text>
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText}>{c.aiReason}</Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>技能标签</Text>
          <View style={styles.skillsRow}>
            {c.skills.map(s => (
              <View key={s} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Resume Tag + Button */}
        <View style={styles.tagsRow}>
          <View style={[styles.resumeTag, { backgroundColor: resumeTagBg }]}>
            <Text style={{ fontSize: 11, fontWeight: '500', color: resumeTagColor }}>{resumeTagText}</Text>
          </View>
          {c.resumeStatus === 'none' && (
            <TouchableOpacity style={styles.resumeBtn} onPress={() => onRequestResume?.(c.id)}>
              <Text style={styles.resumeBtnText}>请求简历</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    padding: 20, maxHeight: 480,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 5,
  },
  indicator: { position: 'absolute', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, borderWidth: 3, zIndex: 20 },
  passIndicator: { top: 20, right: 20, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', transform: [{ rotate: '-15deg' }] },
  passIndicatorText: { fontSize: 18, fontWeight: '700', color: '#059669' },
  rejectIndicator: { top: 20, left: 20, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.1)', transform: [{ rotate: '15deg' }] },
  rejectIndicatorText: { fontSize: 18, fontWeight: '700', color: '#dc2626' },
  pendingIndicator: { bottom: 20, alignSelf: 'center', left: '35%', borderColor: '#d97706', backgroundColor: 'rgba(217,119,6,0.1)' },
  pendingIndicatorText: { fontSize: 18, fontWeight: '700', color: '#d97706' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  title: { fontSize: 13, color: '#6b7280' },
  exp: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  reasonBox: { padding: 12, backgroundColor: 'rgba(99,102,241,0.04)', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#6366f1' },
  reasonText: { fontSize: 14, color: '#1a1a2e', lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: '#f0f0f5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  skillTagText: { fontSize: 12, color: '#6b7280' },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  resumeTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  resumeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)' },
  resumeBtnText: { fontSize: 12, fontWeight: '500', color: '#4f46e5' },
});
