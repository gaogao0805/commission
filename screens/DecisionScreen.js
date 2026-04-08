import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Animated, PanResponder, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';

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
import { getResumeStatusLabel, getMatchingStatus } from '../data/candidates';
import Toast from '../components/Toast';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80;
const SWIPE_DOWN_THRESHOLD = 100;

function SwipeableCard({ candidate, isFront, behind, onSwipe, onNavigate, onRequestResume, cardRef, passProgress, isFirst, isLast }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const pendOp = useRef(new Animated.Value(0)).current;

  // Refs to always have latest values inside PanResponder closure
  const isFrontRef = useRef(isFront);
  isFrontRef.current = isFront;
  const isFirstRef = useRef(isFirst);
  isFirstRef.current = isFirst;
  const isLastRef = useRef(isLast);
  isLastRef.current = isLast;
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const animateOut = useCallback((decision) => {
    const toX = decision === 'pass' ? SCREEN_WIDTH * 1.5 : decision === 'reject' ? -SCREEN_WIDTH * 1.5 : 0;
    const toY = decision === 'pending' ? 800 : 0;
    Animated.timing(pan, { toValue: { x: toX, y: toY }, duration: 350, useNativeDriver: false }).start(() => onSwipeRef.current(decision));
  }, []);

  const animateNavigate = useCallback((direction) => {
    const toX = direction === 'next' ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
    Animated.timing(pan, { toValue: { x: toX, y: 0 }, duration: 300, useNativeDriver: false }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      onNavigateRef.current(direction);
    });
  }, []);

  React.useImperativeHandle(cardRef, () => ({ animateOut }));

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, g) => isFrontRef.current && Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
    onPanResponderMove: (_, g) => {
      pan.setValue({ x: g.dx, y: 0 });
      if (passProgress) passProgress.setValue(0);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD && !isFirstRef.current) animateNavigate('prev');
      else if (g.dx < -SWIPE_THRESHOLD && !isLastRef.current) animateNavigate('next');
      else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 5 }).start();
      }
    },
  })).current;

  const rotate = pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['0deg', '0deg', '0deg'] });
  const c = candidate;
  const initial = c.name.charAt(0);
  const isMale = c.gender === 'male';

  // 简历状态 - 与CandidateScreen完全一致
  let resumeText = null, resumeTagBg = null, resumeTagColor = null, resumeDotColor = '#BBC1C9', resumeAction = null;
  if (c.resumeStatus === 'none') {
    resumeAction = 'request';
  } else if (c.resumeStatus === 'requested') {
    resumeText = '已请求简历'; resumeTagBg = '#FFFBF2'; resumeTagColor = '#E19D16'; resumeDotColor = '#E19D16'; resumeAction = 'waiting';
  } else if (c.resumeStatus === 'has') {
    resumeText = '有简历'; resumeTagBg = '#EBFAF5'; resumeTagColor = '#008B68'; resumeDotColor = '#02A87E'; resumeAction = 'view';
  } else if (c.resumeStatus === 'authorized' || c.resumeStatus === 'proactive') {
    if (c.hasNewResume && !c.newResumeRead) {
      resumeText = '新简历'; resumeTagBg = '#F2FAFF'; resumeTagColor = '#1690E1'; resumeDotColor = '#1690E1';
    } else {
      resumeText = '有简历'; resumeTagBg = '#EBFAF5'; resumeTagColor = '#008B68'; resumeDotColor = '#02A87E';
    }
    resumeAction = 'view';
  }
  const matchStatus = getMatchingStatus(c);

  return (
    <Animated.View
      style={[styles.swipeCard, {
        transform: isFront
          ? [{ translateX: pan.x }, { translateY: pan.y }, { rotate }]
          : behind === 1
            ? [{ rotate: '-1.2deg' }]
            : [{ rotate: '2.02deg' }],
        opacity: isFront ? 1 : 0.8,
        zIndex: isFront ? 10 : behind === 1 ? 5 : 1,
      }]}
      {...(isFront ? panResponder.panHandlers : {})}
    >
      {isFront && (
        <Animated.View style={[styles.ind, styles.indPend, { opacity: pendOp }]}><Text style={styles.indPendT}>待定</Text></Animated.View>
      )}
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={isFront}>
        {/* Profile */}
        <View style={[styles.swipeHeader, styles.sectionPad]}>
          <View style={styles.swipeAvatar}>
            <Text style={styles.swipeAvatarT}>{initial}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.swipeName}>{c.name}</Text>
            <Text style={styles.swipeTitle}>{c.company} · {c.title}</Text>
          </View>
        </View>

        {/* Stats row: full width, no horizontal padding on card */}
        <View style={styles.statsRow}>
          {[['工作经验', c.exp], ['学历', c.edu || '本科'], ['薪资要求', c.expectedSalary || '面议']].map(([label, val]) => (
            <View key={label} style={styles.statCol}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Agent語 */}
        <View style={[styles.agentRow, styles.sectionPad]}>
          <View style={styles.agentIconArea}>
            <Image source={require('../assets/agent-avatar.png')} style={styles.agentAvatar} />
            <View style={styles.agentQuoteWrap}><QuoteIcon /></View>
          </View>
          <Text style={styles.agentText}>{c.aiReason}</Text>
        </View>

        {/* Resume status row - 与CandidateScreen一致 */}
        <View style={styles.resumeStatusRow}>
          <View style={styles.resumeLeftCol}>
            {resumeText && (
              <View style={[styles.resumeTag, { backgroundColor: resumeTagBg }]}>
                <Text style={[styles.resumeTagT, { color: resumeTagColor }]}>{resumeText}</Text>
              </View>
            )}
            {matchStatus && (
              <View style={styles.resumeMatchRow}>
                <View style={[styles.resumeMatchDot, { backgroundColor: matchStatus.type === 'green' ? '#02A87E' : matchStatus.type === 'orange' ? '#E19D16' : '#7B838D' }]} />
                <Text style={[styles.resumeMatchT, { color: matchStatus.type === 'green' ? '#02A87E' : matchStatus.type === 'orange' ? '#E19D16' : '#7B838D' }]}>{matchStatus.text}</Text>
              </View>
            )}
          </View>
          {resumeAction === 'request' && (
            <TouchableOpacity style={styles.rBtn} onPress={() => onRequestResume?.(c.id)}>
              <Text style={styles.rBtnT}>请求简历</Text>
            </TouchableOpacity>
          )}
          {resumeAction === 'view' && (
            <TouchableOpacity style={styles.rBtn}>
              <Text style={styles.rBtnT}>查看简历</Text>
            </TouchableOpacity>
          )}
          {resumeAction === 'waiting' && (
            <Text style={{ fontSize: 13, color: '#BBC1C9' }}>等待授权中</Text>
          )}
        </View>

        {/* 核心技能 */}
        <View style={[styles.expSection, styles.sectionPad]}>
          <View style={styles.expTitleRow}>
            <View style={styles.expTitleBar} />
            <Text style={styles.expTitleText}>核心技能</Text>
          </View>
          <View style={styles.skillsRow}>
            {c.skills.map(s => <View key={s} style={styles.skillTag}><Text style={styles.skillTagT}>{s}</Text></View>)}
          </View>
        </View>

        {/* 工作经验 */}
        <View style={[styles.expSection, styles.sectionPad]}>
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
    // 决策后该卡从newList移除，index保持不动即可显示下一张
    // 只有当列表全部处理完才结束
    setTimeout(() => {
      setIndex(prev => {
        const remaining = newList.length - 1; // 决策后剩余数量
        if (remaining <= 0) {
          setTimeout(() => navigation.goBack(), 1500);
          return 0;
        }
        return Math.min(prev, remaining - 1);
      });
    }, 100);
  }, [index, newList]);

  const handleButton = (decision) => cardRef.current?.animateOut(decision);

  const handleNavigate = useCallback((direction) => {
    setIndex(prev => {
      if (direction === 'next') return Math.min(prev + 1, newList.length - 1);
      if (direction === 'prev') return Math.max(prev - 1, 0);
      return prev;
    });
  }, [newList.length]);

  const handleRequestResume = (id) => {
    updateCandidate(id, { resumeStatus: 'requested' });
    setToast({ visible: true, message: '已发送简历请求', type: 'info' });
  };

  if (newList.length === 0) {
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
          {(() => {
            const front = newList[index];
            if (!front) return null;
            // Always show 3 layers: front + 2 background (from ahead, or fallback to already-seen)
            const bg1 = newList[index + 1] || newList[index - 1] || front;
            const bg2 = newList[index + 2] || newList[index - 2] || front;
            return [bg2, bg1, front].map((c, i) => {
              const pos = 2 - i; // 2=far bg, 1=near bg, 0=front
              return (
                <SwipeableCard
                  key={`${c.id}-${pos}`} candidate={c}
                  isFront={pos === 0} behind={pos}
                  isFirst={index === 0}
                  isLast={index === newList.length - 1}
                  onSwipe={handleSwipe}
                  onNavigate={handleNavigate}
                  onRequestResume={handleRequestResume}
                  passProgress={pos === 0 ? passProgress : undefined}
                  cardRef={pos === 0 ? cardRef : undefined}
                />
              );
            });
          })()}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleButton('reject')}>
          <Text style={{ fontSize: 28, color: '#E8705A', lineHeight: 32 }}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.passBtn]} onPress={() => handleButton('pass')}>
          <Text style={{ fontSize: 28, color: '#fff', lineHeight: 32 }}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.pendBtn]} onPress={() => handleButton('pending')}>
          <Text style={{ fontSize: 28, color: '#D4A840', lineHeight: 32 }}>○</Text>
        </TouchableOpacity>
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
  swipeContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  passBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 275 },
  stack: { width: '100%', flex: 1, position: 'relative' },
  swipeCard: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 5,
  },
  ind: { position: 'absolute', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, borderWidth: 3, zIndex: 20 },
  indPass: { top: 20, right: 20, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', transform: [{ rotate: '-15deg' }] },
  indPassT: { fontSize: 18, fontWeight: '700', color: '#059669' },
  indReject: { top: 20, left: 20, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.1)', transform: [{ rotate: '15deg' }] },
  indRejectT: { fontSize: 18, fontWeight: '700', color: '#dc2626' },
  indPend: { bottom: 20, alignSelf: 'center', left: '35%', borderColor: '#d97706', backgroundColor: 'rgba(217,119,6,0.1)' },
  indPendT: { fontSize: 18, fontWeight: '700', color: '#d97706' },
  swipeHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  swipeAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8e8ed', alignItems: 'center', justifyContent: 'center' },
  swipeAvatarT: { fontSize: 18, fontWeight: '500', color: '#BBC1C9' },
  swipeName: { fontSize: 20, fontWeight: '500', color: '#000', letterSpacing: 0.5, lineHeight: 24 },
  swipeTitle: { fontSize: 13, fontWeight: '400', color: '#656D76', letterSpacing: 0.5 },
  sectionPad: { paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', backgroundColor: '#FDFDFD', paddingHorizontal: 15, paddingVertical: 8 },
  statCol: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 14, fontWeight: '500', color: '#000', lineHeight: 21 },
  statLabel: { fontSize: 12, color: '#9EA7B3', letterSpacing: 0.5 },
  resumeStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  resumeLeftCol: { flexDirection: 'column', gap: 3 },
  resumeTag: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1, alignSelf: 'flex-start' },
  resumeTagT: { fontSize: 10, letterSpacing: 0.5 },
  resumeMatchRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resumeMatchDot: { width: 4, height: 4, borderRadius: 2 },
  resumeMatchT: { fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  rBtn: { backgroundColor: '#EBFAF5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  rBtnT: { fontSize: 14, fontWeight: '500', color: '#009688', lineHeight: 21 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, backgroundColor: '#F8FAFC' },
  skillTagT: { fontSize: 13, color: '#000', lineHeight: 21 },
  expSection: { gap: 16, marginTop: 20 },
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
  agentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 8 },
  agentIconArea: { position: 'relative', marginRight: 4 },
  agentAvatar: { width: 20, height: 20, borderRadius: 10 },
  agentQuoteWrap: { position: 'absolute', top: -8, right: -14 },
  agentText: { flex: 1, fontSize: 13, color: '#9EB3B3', letterSpacing: 0.5, lineHeight: 18 },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 34, paddingVertical: 16, paddingBottom: 40 },
  actionBtn: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 15, height: 13 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 4,
  },
  rejectBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1C4BA' },
  pendBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1E8BA' },
  passBtn: { backgroundColor: '#6FCDAE' },
  allDone: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  doneIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(5,150,105,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  doneText: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 6 },
  doneSub: { fontSize: 13, color: '#9ca3af' },
});
