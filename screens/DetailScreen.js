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

const EditIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M11.2575 3.17238C12.1522 2.27654 13.6032 2.27586 14.4978 3.17043L16.5749 5.24758C17.4614 6.13448 17.4702 7.57039 16.5945 8.46926L8.90109 16.3628C8.31265 16.9665 7.5052 17.3072 6.66281 17.3071L4.36887 17.3062C3.30368 17.3059 2.45313 16.4191 2.49777 15.354L2.59641 13.0122C2.62944 12.2294 2.9559 11.4866 3.50949 10.9321L11.2575 3.17238ZM17.0915 15.9966C17.4364 15.9967 17.7163 16.2766 17.7165 16.6216C17.7165 16.9669 17.4365 17.2475 17.0915 17.2476H11.99C11.645 17.2475 11.365 16.9669 11.365 16.6216C11.3652 16.2766 11.6451 15.9967 11.99 15.9966H17.0915ZM4.39231 11.8159C4.06021 12.1486 3.86428 12.5944 3.84445 13.064L3.7468 15.4058C3.73213 15.7607 4.01582 16.0562 4.37082 16.0562H6.66477C7.16994 16.056 7.65364 15.8518 8.00656 15.4898L13.448 9.90676L9.87082 6.32863L4.39231 11.8159ZM13.614 4.05519C13.2074 3.64859 12.548 3.64904 12.1413 4.05617L10.7546 5.44387L14.321 9.01027L15.6999 7.59719C16.0981 7.18863 16.0941 6.53553 15.6911 6.13234L13.614 4.05519Z" fill="#7B838D"/>
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

      {/* Top warm section */}
      <View style={styles.topSection}>
        {/* AI status */}
        <Text style={styles.aiStatus}>AI持续为您匹配优质候选人中……</Text>

        {/* 待处理 */}
        <TouchableOpacity
          style={styles.pendRow}
          activeOpacity={0.8}
          onPress={() => newCount > 0 && navigation.navigate('NewCandidates')}
        >
          <Text style={styles.pendLabel}>待处理</Text>
          <Text style={styles.pendCount}>{newCount}</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: '通过', count: passCount, tab: 'pass' },
            { label: '待定', count: pendCount, tab: 'pending' },
            { label: '拒绝', count: rejCount, tab: 'reject' },
          ].map(item => (
            <TouchableOpacity key={item.tab} style={styles.statCol} onPress={() => navigation.navigate('Category', { initialTab: item.tab })}>
              <Text style={styles.statNum}>{item.count}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom white card */}
      <View style={styles.bottomCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 招聘偏好 */}
          <View style={styles.prefCard}>
            <View style={styles.prefHeader}>
              <Text style={styles.prefTitle}>招聘偏好</Text>
              <EditIcon />
            </View>
            <View style={styles.prefDivider} />
            <View style={styles.prefList}>
              {hiringPreferences.map((p, i) => (
                <Text key={i} style={styles.prefText}>
                  {p.text + ' '}<Text style={styles.prefTag}>#{p.tag}</Text>
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF7F0' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },

  topSection: { paddingHorizontal: 16, paddingTop: 12, flex: 0 },

  aiStatus: { fontSize: 13, color: '#A48341', letterSpacing: 0.5, fontStyle: 'italic', marginBottom: 59 },

  pendRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 40 },
  pendLabel: { fontSize: 28, fontWeight: '500', color: '#000', letterSpacing: 0.5, lineHeight: 35 },
  pendCount: { fontSize: 28, fontWeight: '500', color: '#A48341', letterSpacing: 0.5, lineHeight: 35 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 34, marginBottom: 28 },
  statCol: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '600', color: '#656D76', textAlign: 'center', letterSpacing: 0.5 },
  statLabel: { fontSize: 12, color: '#9EA7B3', letterSpacing: 0.5 },

  // Bottom white rounded card
  bottomCard: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 20, paddingHorizontal: 16,
  },

  prefCard: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)', padding: 16,
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
    marginBottom: 12,
  },
  prefHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  prefTitle: { fontSize: 14, fontWeight: '500', color: '#000' },
  prefDivider: { height: 0.5, backgroundColor: '#F1F2F4', marginBottom: 9 },
  prefList: { gap: 8 },
  prefText: { fontSize: 13, color: '#7B838D', lineHeight: 21 },
  prefTag: { fontSize: 13, fontWeight: '600', color: '#008B68' },
});
