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
          <View style={styles.prefHeader}>
            <Text style={styles.prefTitle}>岗位详情</Text>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Path d="M11.2575 3.17238C12.1522 2.27654 13.6032 2.27586 14.4978 3.17043L16.5749 5.24758C17.4614 6.13448 17.4702 7.57039 16.5945 8.46926L8.90109 16.3628C8.31265 16.9665 7.5052 17.3072 6.66281 17.3071L4.36887 17.3062C3.30368 17.3059 2.45313 16.4191 2.49777 15.354L2.59641 13.0122C2.62944 12.2294 2.9559 11.4866 3.50949 10.9321L11.2575 3.17238ZM17.0915 15.9966C17.4364 15.9967 17.7163 16.2766 17.7165 16.6216C17.7165 16.9669 17.4365 17.2475 17.0915 17.2476H11.99C11.645 17.2475 11.365 16.9669 11.365 16.6216C11.3652 16.2766 11.6451 15.9967 11.99 15.9966H17.0915ZM4.39231 11.8159C4.06021 12.1486 3.86428 12.5944 3.84445 13.064L3.7468 15.4058C3.73213 15.7607 4.01582 16.0562 4.37082 16.0562H6.66477C7.16994 16.056 7.65364 15.8518 8.00656 15.4898L13.448 9.90676L9.87082 6.32863L4.39231 11.8159ZM13.614 4.05519C13.2074 3.64859 12.548 3.64904 12.1413 4.05617L10.7546 5.44387L14.321 9.01027L15.6999 7.59719C16.0981 7.18863 16.0941 6.53553 15.6911 6.13234L13.614 4.05519Z" fill="#7B838D"/>
            </Svg>
          </View>
          <View style={styles.prefDivider} />
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
              <Path d="M11.2575 3.17238C12.1522 2.27654 13.6032 2.27586 14.4978 3.17043L16.5749 5.24758C17.4614 6.13448 17.4702 7.57039 16.5945 8.46926L8.90109 16.3628C8.31265 16.9665 7.5052 17.3072 6.66281 17.3071L4.36887 17.3062C3.30368 17.3059 2.45313 16.4191 2.49777 15.354L2.59641 13.0122C2.62944 12.2294 2.9559 11.4866 3.50949 10.9321L11.2575 3.17238ZM17.0915 15.9966C17.4364 15.9967 17.7163 16.2766 17.7165 16.6216C17.7165 16.9669 17.4365 17.2475 17.0915 17.2476H11.99C11.645 17.2475 11.365 16.9669 11.365 16.6216C11.3652 16.2766 11.6451 15.9967 11.99 15.9966H17.0915ZM4.39231 11.8159C4.06021 12.1486 3.86428 12.5944 3.84445 13.064L3.7468 15.4058C3.73213 15.7607 4.01582 16.0562 4.37082 16.0562H6.66477C7.16994 16.056 7.65364 15.8518 8.00656 15.4898L13.448 9.90676L9.87082 6.32863L4.39231 11.8159ZM13.614 4.05519C13.2074 3.64859 12.548 3.64904 12.1413 4.05617L10.7546 5.44387L14.321 9.01027L15.6999 7.59719C16.0981 7.18863 16.0941 6.53553 15.6911 6.13234L13.614 4.05519Z" fill="#7B838D"/>
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
    marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  infoTitle: { fontSize: 14, fontWeight: '500', color: '#000' },
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
