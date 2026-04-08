import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../data/AppContext';
import { jobDetails, hiringPreferences } from '../data/candidates';

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export default function DetailScreen({ navigation }) {
  const { getNew, getPassed, getPending, getRejected } = useApp();
  const newCount = getNew().length;
  const passCount = getPassed().length;
  const pendCount = getPending().length;
  const rejCount = getRejected().length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{jobDetails.position}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* AI status */}
        <Text style={styles.aiStatus}>AI持续为您匹配优质候选人中……</Text>

        {/* 待处理 main card */}
        <TouchableOpacity
          style={[styles.mainCard, newCount === 0 && { opacity: 0.7 }]}
          activeOpacity={0.85}
          onPress={() => newCount > 0 && navigation.navigate('NewCandidates')}
        >
          <View style={styles.pendRow}>
            <Text style={styles.pendLabel}>待处理</Text>
            <Text style={styles.pendCount}>{newCount}</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.statsRow}>
            {[
              { label: '通过', count: passCount, color: '#02A87E', tab: 'pass' },
              { label: '待定', count: pendCount, color: '#E19D16', tab: 'pending' },
              { label: '拒绝', count: rejCount, color: '#F48974', tab: 'reject' },
            ].map(item => (
              <TouchableOpacity key={item.tab} style={styles.statCol} onPress={() => navigation.navigate('Category', { initialTab: item.tab })}>
                <Text style={styles.statNum}>{item.count}</Text>
                <Text style={[styles.statLabel, { color: item.color }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>

        {/* Two-column cards */}
        <View style={styles.twoCol}>
          {/* 岗位详情 */}
          <View style={styles.colCard}>
            <Text style={styles.colTitle}>岗位详情</Text>
            <View style={styles.cardDivider} />
            {[jobDetails.position, jobDetails.salary, jobDetails.location, jobDetails.experience, jobDetails.education].map((v, i) => (
              <Text key={i} style={styles.colText}>{v}</Text>
            ))}
            <Text style={styles.colText}>{jobDetails.description}</Text>
          </View>

          {/* 招聘偏好 */}
          <View style={styles.colCard}>
            <Text style={styles.colTitle}>招聘偏好</Text>
            <View style={styles.cardDivider} />
            <View style={styles.prefList}>
              {hiringPreferences.map((p, i) => (
                <Text key={i} style={styles.prefText}>
                  {p.text + ' '}<Text style={styles.prefTag}>#{p.tag}</Text>
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },

  // AI status
  aiStatus: { fontSize: 13, color: '#A48341', letterSpacing: 0.5, fontStyle: 'italic' },

  // Main card
  mainCard: {
    backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 20,
    borderWidth: 1, borderColor: '#fff',
    paddingHorizontal: 34, paddingTop: 18, paddingBottom: 19,
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
    gap: 12,
  },
  pendRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  pendLabel: { fontSize: 28, fontWeight: '500', color: '#000', letterSpacing: 0.5, lineHeight: 35 },
  pendCount: { fontSize: 28, fontWeight: '500', color: '#02A87E', letterSpacing: 0.5, lineHeight: 35 },
  cardDivider: { height: 0.5, backgroundColor: '#F1F2F4' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCol: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '600', color: '#7B838D', textAlign: 'center', letterSpacing: 0.5 },
  statLabel: { fontSize: 12, letterSpacing: 0.5 },

  // Two-column layout
  twoCol: { flexDirection: 'row', gap: 9 },
  colCard: {
    flex: 1, backgroundColor: 'rgba(202,202,202,0.09)',
    borderRadius: 12, borderWidth: 1, borderColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 14, gap: 9,
  },
  colTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  colText: { fontSize: 13, color: '#7B838D', lineHeight: 21 },
  prefList: { gap: 8 },
  prefText: { fontSize: 13, color: '#7B838D', lineHeight: 21 },
  prefTag: { fontSize: 13, fontWeight: '600', color: '#008B68' },
});
