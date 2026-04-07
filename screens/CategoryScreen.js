import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Animated } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useApp } from '../data/AppContext';
import CandidateCard from '../components/CandidateCard';
import Toast from '../components/Toast';

const DECOR_COLORS = {
  pass:    { s0: '#C0F1E1', s1: '#73F5CA', f0: '#BCF1E0', f1: '#75F5CB' },
  pending: { s0: '#F1EAC0', s1: '#F5D773', f0: '#F1E7BC', f1: '#F5C875' },
  reject:  { s0: '#F1C9C0', s1: '#F58973', f0: '#F1C7BC', f1: '#F57575' },
};
const DECOR_PATH = "M13.4133 9.04515C17.03 7.89417 20.4697 7.44813 23.0977 7.64082C24.4132 7.73728 25.4993 7.99139 26.2969 8.37722C27.093 8.76237 27.5604 9.25601 27.739 9.81728C27.9174 10.3784 27.8211 11.0508 27.3941 11.825C26.9662 12.6008 26.2267 13.4359 25.209 14.2749C23.1757 15.951 20.1108 17.5749 16.4941 18.7259C12.8774 19.8769 9.4376 20.3229 6.8096 20.1303C5.49411 20.0338 4.40804 19.7797 3.61044 19.3939C2.81443 19.0088 2.34736 18.5159 2.16863 17.9547C1.99 17.3935 2.08604 16.7206 2.51322 15.9461C2.94114 15.1703 3.68059 14.3352 4.69838 13.4962C6.73169 11.8201 9.79656 10.1961 13.4133 9.04515Z";
const STAR1_PATH = "M32.3365 0.915134L32.3789 1.86957C32.4178 2.74428 32.8369 3.55835 33.5262 4.09821L34.2784 4.68728L33.324 4.72971C32.4492 4.76859 31.6352 5.18767 31.0953 5.877L30.5062 6.62916L30.4638 5.67473C30.4249 4.80002 30.0058 3.98595 29.3165 3.44608L28.5644 2.85701L29.5188 2.81459C30.3935 2.7757 31.2076 2.35662 31.7474 1.66729L32.3365 0.915134Z";
const STAR2_PATH = "M34.2921 6.33423C34.4312 6.94665 34.8308 7.46777 35.3863 7.76087C34.7738 7.89992 34.2527 8.29958 33.9596 8.855C33.8206 8.24257 33.4209 7.72145 32.8655 7.42836C33.4779 7.28931 33.999 6.88965 34.2921 6.33423Z";

function TabDecor({ tabKey }) {
  const c = DECOR_COLORS[tabKey] || DECOR_COLORS.pass;
  const uid = tabKey;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
      <View>
      <Svg width={36} height={24} viewBox="0 0 36 24" fill="none">
        <Path d={DECOR_PATH} stroke={`url(#s${uid})`} />
        <Path d={STAR1_PATH} fill={`url(#f1${uid})`} />
        <Path d={STAR2_PATH} fill={`url(#f2${uid})`} />
        <Defs>
          <LinearGradient id={`s${uid}`} x1="13.2615" y1="8.56873" x2="16.6456" y2="19.2024" gradientUnits="userSpaceOnUse"><Stop stopColor={c.s0} /><Stop offset="1" stopColor={c.s1} /></LinearGradient>
          <LinearGradient id={`f1${uid}`} x1="32.3365" y1="0.915134" x2="30.5062" y2="6.62916" gradientUnits="userSpaceOnUse"><Stop stopColor={c.f0} /><Stop offset="1" stopColor={c.f1} /></LinearGradient>
          <LinearGradient id={`f2${uid}`} x1="34.2921" y1="6.33423" x2="33.9596" y2="8.855" gradientUnits="userSpaceOnUse"><Stop stopColor={c.f0} /><Stop offset="1" stopColor={c.f1} /></LinearGradient>
        </Defs>
      </Svg>
      </View>
    </View>
  );
}

const TABS = [
  { key: 'pass', label: '通过' },
  { key: 'pending', label: '待定' },
  { key: 'reject', label: '拒绝' },
];

function AnimatedCard({ index, children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const base = index * 100;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 60, useNativeDriver: true }),
      ]).start();
    }, base);
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      {children}
    </Animated.View>
  );
}

export default function CategoryScreen({ navigation, route }) {
  const { getPassed, getPending, getRejected, updateCandidate } = useApp();
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'pass');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const readIdsRef = useRef([]);

  const getList = () => {
    let list;
    if (activeTab === 'pass') list = getPassed();
    else if (activeTab === 'pending') list = getPending();
    else list = getRejected();
    return [...list].sort((a, b) => {
      const intentOrder = { connect: 0, later: 1, reject: 2 };
      const intentDiff = (intentOrder[a.seekerIntent] ?? 1) - (intentOrder[b.seekerIntent] ?? 1);
      if (intentDiff !== 0) return intentDiff;
      const resumeRank = (c) => (c.hasNewResume && !c.newResumeRead) ? 0 : c.resumeStatus !== 'none' ? 1 : 2;
      return resumeRank(a) - resumeRank(b);
    });
  };

  const counts = { pass: getPassed().length, pending: getPending().length, reject: getRejected().length };
  const hasUnread = {
    pass: getPassed().some(c => c.hasNewResume && !c.newResumeRead),
    pending: getPending().some(c => c.hasNewResume && !c.newResumeRead),
    reject: getRejected().some(c => c.hasNewResume && !c.newResumeRead),
  };

  const flushReadResumes = () => {
    if (readIdsRef.current.length === 0) return;
    readIdsRef.current.forEach(({ id, resumeStatus }) => {
      updateCandidate(id, { hasNewResume: false, resumeStatus: resumeStatus === 'proactive' ? 'authorized' : resumeStatus });
    });
    readIdsRef.current = [];
  };

  const handleCardPress = (c) => {
    if (c.hasNewResume && !c.newResumeRead) {
      updateCandidate(c.id, { newResumeRead: true });
      readIdsRef.current.push({ id: c.id, resumeStatus: c.resumeStatus });
    }
    navigation.navigate('Candidate', { candidateId: c.id });
  };

  const handleTabChange = (tab) => {
    flushReadResumes();
    setActiveTab(tab);
  };

  const handleRequestResume = (id) => {
    updateCandidate(id, { resumeStatus: 'requested' });
    setToast({ visible: true, message: '已发送简历请求', type: 'info' });
    setTimeout(() => {
      updateCandidate(id, { resumeStatus: 'authorized', hasNewResume: true, newResumeRead: false });
      setToast({ visible: true, message: '候选人已授权简历', type: 'success' });
    }, 3000);
  };

  const list = getList();

  return (
    <SafeAreaView style={styles.safe}>
      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { flushReadResumes(); navigation.goBack(); }}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.navTitle}>候选人管理</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => handleTabChange(tab.key)}>
              {active ? (
                <View style={styles.activeTabContent}>
                  <TabDecor tabKey={tab.key} />
                  <Text style={[styles.tabText, styles.tabTextActive]}>
                    {tab.label} · {counts[tab.key]}
                  </Text>
                  {hasUnread[tab.key] && <View style={styles.unreadDot} />}
                </View>
              ) : (
                <View style={{ position: 'relative' }}>
                  <Text style={styles.tabText}>{tab.label}</Text>
                  {hasUnread[tab.key] && <View style={styles.unreadDot} />}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab gradient background */}
      <View pointerEvents="none" style={styles.passGradient}>
        <Svg width="100%" height={275} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="tabGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={activeTab === 'pass' ? '#8EF1CD' : activeTab === 'pending' ? '#F1D88E' : '#F1988E'} stopOpacity="0.5" />
              <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="275" fill="url(#tabGrad)" />
        </Svg>
      </View>

      {/* List */}
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>○</Text>
          <Text style={styles.emptyText}>暂无{TABS.find(t => t.key === activeTab)?.label}的候选人</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <AnimatedCard index={index}>
              <CandidateCard
                candidate={item}
                onPress={() => handleCardPress(item)}
                onRequestResume={handleRequestResume}
              />
            </AnimatedCard>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB', position: 'relative' },
  passGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 275, zIndex: 0 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9, zIndex: 1 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },
  tabBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 4, marginTop: 0, zIndex: 1 },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  activeTabContent: { alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 14, fontWeight: '400', color: '#656D76', lineHeight: 21 },
  tabTextActive: { fontSize: 18, fontWeight: '600', color: '#000', letterSpacing: 0.5, lineHeight: 24 },
  unreadDot: { position: 'absolute', top: 0, right: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#F55252' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 },
  emptyIcon: { fontSize: 48, opacity: 0.3, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});
