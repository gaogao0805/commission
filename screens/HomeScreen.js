import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useApp } from '../data/AppContext';
import { agentMessages } from '../data/candidates';

export default function HomeScreen({ navigation }) {
  const { getNew, getResumeUpdateCount } = useApp();
  const [agentText, setAgentText] = useState('');
  const dotOpacity = useRef(new Animated.Value(1)).current;

  // Agent typing animation
  useEffect(() => {
    let msgIdx = 0, charIdx = 0, timer;
    const type = () => {
      const msg = agentMessages[msgIdx];
      if (charIdx <= msg.length) {
        setAgentText(msg.slice(0, charIdx));
        charIdx++;
        timer = setTimeout(type, 40 + Math.random() * 30);
      } else {
        timer = setTimeout(() => { charIdx = 0; msgIdx = (msgIdx + 1) % agentMessages.length; type(); }, 3000);
      }
    };
    type();
    return () => clearTimeout(timer);
  }, []);

  // Pulsing dot
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 0.4, duration: 1000, useNativeDriver: false }),
        Animated.timing(dotOpacity, { toValue: 1, duration: 1000, useNativeDriver: false }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const newCount = getNew().length;
  const resumeCount = getResumeUpdateCount();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>招人才</Text>
            <Text style={styles.subtitle}>AI 经纪人为您精准匹配</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
        </View>

        {/* Commission Card */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('Detail')}>
          <View style={styles.cardAccent} />
          <View style={styles.tag}><Text style={styles.tagText}>进行中</Text></View>
          <Text style={styles.cardTitle}>高级前端程序员</Text>
          <Text style={styles.cardSalary}>15K - 25K · 杭州</Text>

          <View style={styles.agentStatus}>
            <Animated.View style={[styles.agentDot, { opacity: dotOpacity }]} />
            <Text style={styles.agentText}>{agentText + '|'}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statItem, newCount > 0 && styles.statItemActive]}>
              <Text style={[styles.statNumber, newCount > 0 && styles.statNumberActive]}>{newCount}</Text>
              <Text style={styles.statLabel}>新候选人</Text>
              {newCount > 0 && <View style={styles.statGlow} />}
            </View>
            <View style={[styles.statItem, resumeCount > 0 && styles.statItemActive]}>
              <Text style={[styles.statNumber, resumeCount > 0 && styles.statNumberActive]}>{resumeCount}</Text>
              <Text style={styles.statLabel}>简历更新</Text>
              {resumeCount > 0 && <View style={styles.statGlow} />}
            </View>
          </View>

          <View style={styles.enterRow}>
            <Text style={styles.enterText}>查看详情</Text>
            <Text style={styles.enterArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Nav Mock */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <Text style={[styles.navIcon, styles.navActive]}>📋</Text>
            <Text style={[styles.navLabel, { color: '#4f46e5' }]}>委托</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>💬</Text>
            <Text style={styles.navLabel}>消息</Text>
          </View>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>我的</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f2f7' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, color: '#1a1a2e' },
  subtitle: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  card: {
    margin: 16, marginTop: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3,
    overflow: 'hidden',
  },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#6366f1' },
  tag: { backgroundColor: 'rgba(99,102,241,0.08)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 },
  tagText: { fontSize: 11, fontWeight: '500', color: '#4f46e5' },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  cardSalary: { fontSize: 14, color: '#4f46e5', fontWeight: '500', marginBottom: 12 },
  agentStatus: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, paddingHorizontal: 14,
    borderRadius: 10, backgroundColor: 'rgba(99,102,241,0.04)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.08)',
    marginBottom: 16, minHeight: 44,
  },
  agentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366f1' },
  agentText: { fontSize: 12, color: '#4f46e5', flex: 1, lineHeight: 17 },
  cursor: { color: '#6366f1' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statItem: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.02)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', alignItems: 'center', position: 'relative' },
  statItemActive: {},
  statNumber: { fontSize: 24, fontWeight: '700', color: '#9ca3af' },
  statNumberActive: { color: '#059669' },
  statLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  statGlow: { position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#dc2626' },
  enterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, gap: 4 },
  enterText: { fontSize: 12, color: '#9ca3af' },
  enterArrow: { fontSize: 16, color: '#9ca3af' },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 8, paddingBottom: 26, backgroundColor: '#f2f2f7', marginTop: 'auto' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 20, opacity: 0.4 },
  navActive: { opacity: 1 },
  navLabel: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
});
