import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Animated, PanResponder, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const COMPANY_COLORS = {
  '字节跳动': '#1A1A1A', '蚂蚁集团': '#1677FF', '网易': '#D0021B', '拼多多': '#E02E24',
  '阿里巴巴': '#FF6A00', '美团': '#FFD100', '腾讯': '#12B7F5', '京东': '#E1251B',
  '小红书': '#FF2442', '快手': '#FF4906', '华为': '#CF0A2C', '中兴通讯': '#0066CC',
  'B站': '#FB7299', '米哈游': '#1A73E8', '滴滴出行': '#FF8C00', '百度': '#2932E1',
  '小米': '#FF6900', '广告公司': '#888', '创业公司': '#888',
};
const getCompanyColor = (co) => COMPANY_COLORS[co] || '#7B838D';
const getCompanyTextColor = (co) => co === '美团' ? '#333' : '#fff';

function QuoteIcon() {
  return (
    <Svg width={14} height={10} viewBox="0 0 14 10" fill="none">
      <Path opacity={0.5} d="M11.2596 0L12.5404 1.19186L10.9319 2.87791C11.2894 3.38178 11.7163 3.90504 12.2128 4.44767C12.7291 4.99031 13.3248 5.56201 14 6.16279C13.4837 6.70543 12.9078 7.24806 12.2723 7.7907C11.6369 8.31395 11.0511 8.75969 10.5149 9.12791C9.81986 8.25581 9.16454 7.37403 8.54894 6.48256C7.93333 5.5717 7.36738 4.67054 6.85106 3.77907C7.5461 3.23643 8.27092 2.63566 9.02553 1.97674C9.8 1.31783 10.5447 0.658914 11.2596 0ZM4.40851 0.872092L5.68936 2.06395L4.08085 3.75C4.4383 4.25388 4.86525 4.77713 5.3617 5.31977C5.87801 5.8624 6.47376 6.43411 7.14894 7.03488C6.63262 7.57752 6.05674 8.12016 5.42128 8.66279C4.78582 9.18605 4.2 9.63178 3.66383 10C2.96879 9.12791 2.31348 8.24612 1.69787 7.35465C1.08227 6.4438 0.516312 5.54264 0 4.65116C0.695035 4.10853 1.41986 3.50775 2.17447 2.84884C2.94894 2.18992 3.69362 1.53101 4.40851 0.872092Z" fill="#DDE2E8" />
    </Svg>
  );
}

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
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

  let rTag = { text: '暂无简历', color: '#BBC1C9' };
  if (c.hasNewResume && !c.newResumeRead) rTag = { text: '新简历', color: '#1690E1' };
  else if (resumeLabel) {
    const cm = { new: '#1690E1', requested: '#E19D16', has: '#02A87E' };
    rTag = { text: resumeLabel.text, color: cm[resumeLabel.type] || '#02A87E' };
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
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={isFront} contentContainerStyle={{ gap: 20, paddingBottom: 8 }}>
        {/* Profile: avatar + name + title */}
        <View style={styles.swipeHeader}>
          <View style={styles.swipeAvatar}>
            <Text style={styles.swipeAvatarT}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.swipeName}>{c.name}</Text>
            <Text style={styles.swipeTitle}>{c.title}</Text>
          </View>
        </View>

        {/* Stats row: 经验 / 学历 / 薪资 */}
        <View style={styles.statsRow}>
          {[['工作经验', c.exp], ['学历', c.edu || '本科'], ['薪资要求', c.expectedSalary || '面议']].map(([label, val]) => (
            <View key={label} style={styles.statCol}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Resume status row */}
        <View style={styles.resumeStatusRow}>
          <View style={styles.resumeStatusLeft}>
            {rTag.text !== '暂无简历' && <View style={[styles.rTagDot, { backgroundColor: rTag.color }]} />}
            <Text style={[styles.rTagText, { color: rTag.color }]}>{rTag.text}</Text>
          </View>
          {c.resumeStatus === 'none' && (
            <TouchableOpacity style={styles.rBtn} onPress={() => onRequestResume?.(c.id)}>
              <Text style={styles.rBtnT}>请求简历</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 核心技能 */}
        <View style={styles.expSection}>
          <View style={styles.expTitleRow}>
            <View style={styles.expTitleBar} />
            <Text style={styles.expTitleText}>核心技能</Text>
          </View>
          <View style={styles.skillsRow}>
            {c.skills.map(s => <View key={s} style={styles.skillTag}><Text style={styles.skillTagT}>{s}</Text></View>)}
          </View>
        </View>

        {/* 工作经验 */}
        <View style={styles.expSection}>
          <View style={styles.expTitleRow}>
            <View style={styles.expTitleBar} />
            <Text style={styles.expTitleText}>工作经验</Text>
          </View>
          {(c.workHistory || [{ company: c.company, title: c.title, period: '至今' }]).flatMap((w, i) => [
            i > 0 ? <View key={`d${i}`} style={styles.expDivider} /> : null,
            <View key={i} style={styles.expItem}>
              <View style={styles.expItemTop}>
                <View style={styles.expCompanyLeft}>
                  <View style={[styles.expLogo, { backgroundColor: getCompanyColor(w.company) }]}>
                    <Text style={[styles.expLogoT, { color: getCompanyTextColor(w.company) }]}>{w.company.charAt(0)}</Text>
                  </View>
                  <Text style={styles.expCompany}>{w.company}</Text>
                </View>
                <Text style={styles.expDate}>{w.period}</Text>
              </View>
              <Text style={styles.expRole}>{w.title}</Text>
            </View>,
          ])}
        </View>

        {/* Agent語 */}
        <View style={styles.agentRow}>
          <View style={styles.agentIconArea}>
            <Image source={require('../assets/agent-avatar.png')} style={styles.agentAvatar} />
            <View style={styles.agentQuoteWrap}><QuoteIcon /></View>
          </View>
          <Text style={styles.agentText}>{c.aiReason}</Text>
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
    setToast({ visible: true, message: `${labels[decision]} · ${c.name}`, type: decision });
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
          <BackIcon />
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
  safe: { flex: 1, backgroundColor: '#FBFBFB' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9, zIndex: 1 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },
  counter: { fontSize: 14, color: '#7B838D', fontWeight: '500' },
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
  swipeHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  swipeAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8e8ed', alignItems: 'center', justifyContent: 'center' },
  swipeAvatarT: { fontSize: 18, fontWeight: '500', color: '#BBC1C9' },
  swipeName: { fontSize: 20, fontWeight: '500', color: '#000', letterSpacing: 0.5, lineHeight: 24 },
  swipeTitle: { fontSize: 16, fontWeight: '400', color: '#000', letterSpacing: 0.5, lineHeight: 24 },
  statsRow: { flexDirection: 'row', backgroundColor: '#FDFDFD', paddingHorizontal: 15, paddingVertical: 8, alignSelf: 'stretch', marginHorizontal: -20 },
  statCol: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 14, fontWeight: '600', color: '#000', lineHeight: 21 },
  statLabel: { fontSize: 12, color: '#9EA7B3', letterSpacing: 0.5 },
  resumeStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch', marginHorizontal: -20, paddingHorizontal: 18 },
  resumeStatusLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rTagDot: { width: 4, height: 4, borderRadius: 2 },
  rTagText: { fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  rBtn: { backgroundColor: '#EBFAF5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  rBtnT: { fontSize: 14, fontWeight: '500', color: '#009688', lineHeight: 21 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, backgroundColor: '#F8FAFC' },
  skillTagT: { fontSize: 13, color: '#000', lineHeight: 21 },
  expSection: { gap: 16 },
  expTitleRow: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  expTitleBar: { width: 4, borderRadius: 999, backgroundColor: '#6FCDAE' },
  expTitleText: { fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 },
  expItem: { gap: 4, paddingLeft: 12 },
  expItemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 21 },
  expCompanyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expLogo: { width: 21, height: 21, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  expLogoT: { fontSize: 10, fontWeight: '600' },
  expCompany: { fontSize: 14, fontWeight: '500', color: '#000', lineHeight: 21 },
  expDate: { fontSize: 12, fontWeight: '300', color: '#78787D', lineHeight: 21 },
  expRole: { fontSize: 13, fontWeight: '400', color: '#000', letterSpacing: 0.5, lineHeight: 18, paddingLeft: 29 },
  expDivider: { height: 0.5, backgroundColor: '#F1F2F4', marginLeft: 12 },
  agentRow: { flexDirection: 'row', alignItems: 'center' },
  agentIconArea: { position: 'relative', marginRight: 4 },
  agentAvatar: { width: 20, height: 20, borderRadius: 10 },
  agentQuoteWrap: { position: 'absolute', top: -8, right: -14 },
  agentText: { flex: 1, fontSize: 13, color: '#9EB3B3', letterSpacing: 0.5, lineHeight: 18 },
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
