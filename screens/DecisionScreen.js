import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, PanResponder, Dimensions, ScrollView } from 'react-native';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useApp } from '../data/AppContext';
import { getResumeStatusLabel } from '../data/candidates';
import Toast from '../components/Toast';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80;
const SWIPE_DOWN_THRESHOLD = 100;

function SwipeableCard({ candidate, isFront, behind, onSwipe, onRequestResume, cardRef, passProgress }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const passOp = useRef(new Animated.Value(0)).current;
  const rejectOp = useRef(new Animated.Value(0)).current;
  const pendOp = useRef(new Animated.Value(0)).current;

  const animateOut = useCallback((decision) => {
    const toX = decision === 'pass' ? SCREEN_WIDTH * 1.5 : decision === 'reject' ? -SCREEN_WIDTH * 1.5 : 0;
    const toY = decision === 'pending' ? 800 : 0;
    Animated.timing(pan, { toValue: { x: toX, y: toY }, duration: 350, useNativeDriver: false }).start(() => onSwipe(decision));
  }, [onSwipe]);

  React.useImperativeHandle(cardRef, () => ({ animateOut }));

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => isFront,
    onMoveShouldSetPanResponder: (_, g) => isFront && (Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8),
    onPanResponderMove: (_, g) => {
      pan.setValue({ x: g.dx, y: Math.max(0, g.dy) });
      const pv = Math.min(Math.max(g.dx / SWIPE_THRESHOLD, 0), 1);
      passOp.setValue(pv);
      if (passProgress) passProgress.setValue(pv);
      rejectOp.setValue(Math.min(Math.max(-g.dx / SWIPE_THRESHOLD, 0), 1));
      pendOp.setValue(Math.min(Math.max(g.dy / SWIPE_DOWN_THRESHOLD, 0), 1) * Math.max(0, 1 - Math.abs(g.dx) / 200));
    },
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD) animateOut('pass');
      else if (g.dx < -SWIPE_THRESHOLD) animateOut('reject');
      else if (g.dy > SWIPE_DOWN_THRESHOLD && Math.abs(g.dx) < 50) animateOut('pending');
      else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        [passOp, rejectOp, pendOp, passProgress].filter(Boolean).forEach(o => Animated.timing(o, { toValue: 0, duration: 200, useNativeDriver: false }).start());
      }
    },
  })).current;

  const rotate = pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-15deg', '0deg', '15deg'] });
  const c = candidate;
  const initial = c.name.charAt(0);
  const isMale = c.gender === 'male';
  const resumeLabel = getResumeStatusLabel(c);

  let rTag = { text: '暂无简历', color: '#9ca3af', bg: 'rgba(0,0,0,0.04)' };
  if (c.hasNewResume && !c.newResumeRead) rTag = { text: '新简历', color: '#059669', bg: 'rgba(5,150,105,0.08)' };
  else if (resumeLabel) {
    const cm = { new: '#059669', requested: '#3b82f6', has: '#4f46e5' };
    const bm = { new: 'rgba(5,150,105,0.08)', requested: 'rgba(59,130,246,0.08)', has: 'rgba(99,102,241,0.08)' };
    rTag = { text: resumeLabel.text, color: cm[resumeLabel.type] || '#4f46e5', bg: bm[resumeLabel.type] || 'rgba(99,102,241,0.08)' };
  }

  return (
    <Animated.View
      style={[styles.swipeCard, {
        transform: isFront ? [{ translateX: pan.x }, { translateY: pan.y }, { rotate }]
          : [{ scale: behind === 1 ? 0.95 : 0.9 }, { translateY: behind === 1 ? 12 : 24 }],
        opacity: isFront ? 1 : behind === 1 ? 0.5 : 0.3,
        zIndex: isFront ? 10 : behind === 1 ? 5 : 1,
      }]}
      {...(isFront ? panResponder.panHandlers : {})}
    >
      {isFront && (
        <>
          <Animated.View style={[styles.ind, styles.indPass, { opacity: passOp }]}><Text style={styles.indPassT}>通过</Text></Animated.View>
          <Animated.View style={[styles.ind, styles.indReject, { opacity: rejectOp }]}><Text style={styles.indRejectT}>拒绝</Text></Animated.View>
          <Animated.View style={[styles.ind, styles.indPend, { opacity: pendOp }]}><Text style={styles.indPendT}>待定</Text></Animated.View>
        </>
      )}
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={isFront}>
        <View style={styles.swipeHeader}>
          <View style={[styles.swipeAvatar, { backgroundColor: isMale ? '#dbeafe' : '#f3e8ff' }]}>
            <Text style={[styles.swipeAvatarT, { color: isMale ? '#2563eb' : '#7c3aed' }]}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.swipeName}>{c.name}</Text>
            <Text style={styles.swipeTitle}>{c.title} · {c.company}</Text>
            <Text style={styles.swipeExp}>{c.exp}经验 · {c.location}</Text>
          </View>
        </View>
        <Text style={styles.secTitle}>AI 推荐理由</Text>
        <View style={styles.reasonBox}><Text style={styles.reasonText}>{c.aiReason}</Text></View>
        <Text style={[styles.secTitle, { marginTop: 14 }]}>技能标签</Text>
        <View style={styles.skillsRow}>
          {c.skills.map(s => <View key={s} style={styles.skillTag}><Text style={styles.skillTagT}>{s}</Text></View>)}
        </View>
        <View style={styles.tagsRow}>
          <View style={[styles.rTag, { backgroundColor: rTag.bg }]}><Text style={{ fontSize: 11, fontWeight: '500', color: rTag.color }}>{rTag.text}</Text></View>
          {c.resumeStatus === 'none' && (
            <TouchableOpacity style={styles.rBtn} onPress={() => onRequestResume?.(c.id)}>
              <Text style={styles.rBtnT}>请求简历</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

export default function DecisionScreen({ navigation, route }) {
  const { getNew, updateCandidate } = useApp();
  const candidateId = route.params?.candidateId;
  const cardRef = useRef();
  const passProgress = useRef(new Animated.Value(0)).current;
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const newList = getNew();
  // If coming from list, start at the tapped candidate's position
  const startIndex = candidateId ? Math.max(0, newList.findIndex(c => c.id === candidateId)) : 0;
  const [index, setIndex] = useState(startIndex);

  const handleSwipe = useCallback((decision) => {
    const c = newList[index];
    if (!c) return;
    updateCandidate(c.id, { recruiterDecision: decision === 'pass' ? 'pass' : decision === 'reject' ? 'reject' : 'pending' });
    const labels = { pass: '已通过', pending: '已待定', reject: '已拒绝' };
    setToast({ visible: true, message: `${labels[decision]} · ${c.name}`, type: decision === 'pass' ? 'success' : 'info' });
    setTimeout(() => {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= newList.length) setTimeout(() => navigation.goBack(), 1500);
        return next;
      });
    }, 100);
  }, [index, newList, candidateId]);

  const handleButton = (decision) => cardRef.current?.animateOut(decision);

  const handleRequestResume = (id) => {
    updateCandidate(id, { resumeStatus: 'requested' });
    setToast({ visible: true, message: '已发送简历请求', type: 'info' });
  };

  if (index >= newList.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.allDone}>
          <View style={styles.doneIcon}><Text style={{ fontSize: 36 }}>✓</Text></View>
          <Text style={styles.doneText}>全部处理完成</Text>
          <Text style={styles.doneSub}>候选人已分配到对应分类</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>待处理</Text>
        <Text style={styles.counter}>{index + 1}/{newList.length}</Text>
      </View>

      <View style={styles.swipeContainer}>
        <Animated.View pointerEvents="none" style={[styles.passBg, { opacity: passProgress }]}>
          <Svg width="100%" height="275" preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="passBgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#8EF1CD" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="275" fill="url(#passBgGrad)" />
          </Svg>
        </Animated.View>
        <View style={styles.stack}>
          {newList.slice(index, index + 3).reverse().map((c, i, arr) => {
            const pos = arr.length - 1 - i;
            return (
              <SwipeableCard
                key={c.id} candidate={c}
                isFront={pos === 0} behind={pos}
                onSwipe={handleSwipe}
                onRequestResume={handleRequestResume}
                passProgress={pos === 0 ? passProgress : undefined}
                cardRef={pos === 0 ? cardRef : undefined}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.actionWrap}>
          <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleButton('reject')}>
            <Text style={{ fontSize: 24, color: '#dc2626' }}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: '#dc2626' }]}>拒绝</Text>
        </View>
        <View style={styles.actionWrap}>
          <TouchableOpacity style={[styles.actionBtn, styles.pendBtn]} onPress={() => handleButton('pending')}>
            <Text style={{ fontSize: 24, color: '#d97706' }}>—</Text>
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: '#d97706' }]}>待定</Text>
        </View>
        <View style={styles.actionWrap}>
          <TouchableOpacity style={[styles.actionBtn, styles.passBtn]} onPress={() => handleButton('pass')}>
            <Text style={{ fontSize: 24, color: '#fff' }}>✓</Text>
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: '#059669' }]}>通过</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f2f7' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#1a1a2e', marginTop: -2 },
  navTitle: { fontSize: 17, fontWeight: '600' },
  counter: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
  swipeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, position: 'relative' },
  passBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 275 },
  stack: { width: '100%', height: 480, position: 'relative' },
  swipeCard: {
    position: 'absolute', top: 0, left: 0, right: 0, maxHeight: 480,
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 5,
  },
  ind: { position: 'absolute', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, borderWidth: 3, zIndex: 20 },
  indPass: { top: 20, right: 20, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', transform: [{ rotate: '-15deg' }] },
  indPassT: { fontSize: 18, fontWeight: '700', color: '#059669' },
  indReject: { top: 20, left: 20, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.1)', transform: [{ rotate: '15deg' }] },
  indRejectT: { fontSize: 18, fontWeight: '700', color: '#dc2626' },
  indPend: { bottom: 20, alignSelf: 'center', left: '35%', borderColor: '#d97706', backgroundColor: 'rgba(217,119,6,0.1)' },
  indPendT: { fontSize: 18, fontWeight: '700', color: '#d97706' },
  swipeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  swipeAvatar: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  swipeAvatarT: { fontSize: 22, fontWeight: '600' },
  swipeName: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  swipeTitle: { fontSize: 13, color: '#6b7280' },
  swipeExp: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  secTitle: { fontSize: 11, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  reasonBox: { padding: 12, backgroundColor: 'rgba(99,102,241,0.04)', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#6366f1' },
  reasonText: { fontSize: 14, color: '#1a1a2e', lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: '#f0f0f5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  skillTagT: { fontSize: 12, color: '#6b7280' },
  tagsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  rTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  rBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)' },
  rBtnT: { fontSize: 12, fontWeight: '500', color: '#4f46e5' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingVertical: 16, paddingBottom: 40 },
  actionWrap: { alignItems: 'center', gap: 8 },
  actionBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: 'rgba(220,38,38,0.2)' },
  pendBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: 'rgba(217,119,6,0.2)' },
  passBtn: { backgroundColor: '#059669', borderWidth: 2, borderColor: 'rgba(5,150,105,0.2)' },
  actionLabel: { fontSize: 11, fontWeight: '600' },
  allDone: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  doneIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(5,150,105,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  doneText: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 6 },
  doneSub: { fontSize: 13, color: '#9ca3af' },
});
