import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../data/AppContext';
import { jobDetails, hiringPreferences } from '../data/candidates';

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
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>委托</Text>
        <TouchableOpacity style={styles.memoryBtn} onPress={() => {}}>
          <Text style={styles.memoryText}>记忆</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Agent mini */}
        <View style={styles.agentMini}>
          <View style={styles.miniDot} />
          <Text style={styles.miniText}>AI 持续为您匹配优质候选人中...</Text>
        </View>

        {/* Pending action */}
        <TouchableOpacity
          style={[styles.pendingAction, newCount === 0 && styles.pendingDisabled]}
          activeOpacity={0.8}
          onPress={() => newCount > 0 && navigation.navigate('Decision')}
          disabled={newCount === 0}
        >
          <View style={styles.pendingAccent} />
          <Text style={styles.pendingNumber}>{newCount}</Text>
          <Text style={styles.pendingLabel}>{newCount > 0 ? '新候选人待处理' : '暂无新候选人'}</Text>
          <Text style={styles.pendingHint}>{newCount > 0 ? '点击逐个处理，支持滑动决策' : 'AI 经纪人正在为您搜索中'}</Text>
        </TouchableOpacity>

        {/* Category stats */}
        <View style={styles.catRow}>
          {[
            { label: '通过', count: passCount, color: '#059669', tab: 'pass' },
            { label: '待定', count: pendCount, color: '#d97706', tab: 'pending' },
            { label: '拒绝', count: rejCount, color: '#9ca3af', tab: 'reject' },
          ].map(item => (
            <TouchableOpacity key={item.tab} style={styles.catItem} activeOpacity={0.8}
              onPress={() => navigation.navigate('Category', { initialTab: item.tab })}>
              <Text style={[styles.catNumber, { color: item.color }]}>{item.count}</Text>
              <Text style={styles.catLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job details */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>岗位详情</Text>
          {[
            ['岗位名称', jobDetails.position],
            ['薪资范围', jobDetails.salary, '#4f46e5'],
            ['工作地点', jobDetails.location],
            ['经验要求', jobDetails.experience],
            ['学历要求', jobDetails.education],
          ].map(([label, value, color]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={[styles.infoValue, color && { color }]}>{value}</Text>
            </View>
          ))}
          <Text style={styles.infoDesc}>{jobDetails.description}</Text>
        </View>

        {/* Hiring preferences */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>招聘偏好</Text>
          {hiringPreferences.map((p, i) => (
            <View key={i} style={styles.prefItem}>
              <Text style={styles.prefText}>{p.text}</Text>
              <View style={styles.hashtag}><Text style={styles.hashtagText}>#{p.tag}</Text></View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDE2E8', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#000', marginTop: -2 },
  navTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  memoryBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#EBFAF5' },
  memoryText: { fontSize: 14, color: '#008B68' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  agentMini: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 16, marginBottom: 12, padding: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#EBFAF5', borderWidth: 1, borderColor: 'rgba(111,205,174,0.3)' },
  miniDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#02A87E' },
  miniText: { fontSize: 11, color: '#008B68' },
  pendingAction: {
    marginHorizontal: 16, marginBottom: 16, padding: 18, borderRadius: 16, alignItems: 'center', overflow: 'hidden',
    backgroundColor: '#EBFAF5', borderWidth: 1, borderColor: 'rgba(111,205,174,0.3)',
  },
  pendingAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#02A87E' },
  pendingDisabled: { opacity: 0.5 },
  pendingNumber: { fontSize: 36, fontWeight: '700', color: '#02A87E', marginBottom: 4 },
  pendingLabel: { fontSize: 14, color: '#7B838D', fontWeight: '500' },
  pendingHint: { fontSize: 12, color: '#BBC1C9', marginTop: 6 },
  catRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  catItem: {
    flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
  },
  catNumber: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  catLabel: { fontSize: 12, color: '#7B838D', fontWeight: '500' },
  infoSection: {
    marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
  },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#000', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: '#7B838D' },
  infoValue: { fontSize: 13, fontWeight: '500', color: '#000' },
  infoDesc: { fontSize: 13, color: '#7B838D', lineHeight: 20, marginTop: 10 },
  prefItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  prefText: { fontSize: 13, color: '#7B838D', lineHeight: 20, marginBottom: 6 },
  hashtag: { backgroundColor: '#EBFAF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  hashtagText: { fontSize: 11, fontWeight: '500', color: '#008B68' },
});
