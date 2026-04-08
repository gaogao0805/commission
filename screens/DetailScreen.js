import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
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
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.navTitle}>委托</Text>
        <TouchableOpacity style={styles.memoryBtn} onPress={() => {}}>
          <Text style={styles.memoryText}>记忆</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Agent mini */}
        <View style={styles.agentMini}>
          <View style={styles.miniDot} />
          <Text style={styles.miniText}>AI 持续为您匹配优质候选人中...</Text>
        </View>

        {/* Pending action */}
        <TouchableOpacity
          style={[styles.pendingAction, newCount === 0 && styles.pendingDisabled]}
          activeOpacity={0.8}
          onPress={() => newCount > 0 && navigation.navigate('NewCandidates')}
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
        <View style={styles.prefCard}>
          <View style={styles.prefHeader}>
            <Text style={styles.prefTitle}>招聘偏好</Text>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Path d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.8715 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.8715 16.7347 1.98996C17.0207 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.2656C18.1287 3.5516 18.1897 3.85811 18.1897 4.16757C18.1897 4.47703 18.1287 4.78354 18.0103 5.06954C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z" stroke="#7B838D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View style={styles.prefDivider} />
          <View style={styles.prefList}>
            {hiringPreferences.map((p, i) => (
              <Text key={i} style={styles.prefItemText}>
                {p.text + ' '}<Text style={styles.prefTag}>#{p.tag}</Text>
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9, zIndex: 1 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },
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
  prefCard: {
    marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  prefHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  prefTitle: { fontSize: 14, fontWeight: '500', color: '#000' },
  prefDivider: { height: 0.5, backgroundColor: '#F1F2F4', marginBottom: 9 },
  prefList: { gap: 8 },
  prefItemText: { fontSize: 13, color: '#7B838D', lineHeight: 21 },
  prefTag: { fontSize: 13, fontWeight: '600', color: '#008B68' },
});
