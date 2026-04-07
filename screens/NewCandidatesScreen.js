import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../data/AppContext';
import CandidateCard from '../components/CandidateCard';
import Toast from '../components/Toast';

export default function NewCandidatesScreen({ navigation }) {
  const { getNew, updateCandidate } = useApp();
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const list = getNew();

  const handleCardPress = (c) => {
    if (c.hasNewResume && !c.newResumeRead) {
      updateCandidate(c.id, { newResumeRead: true, hasNewResume: false, resumeStatus: c.resumeStatus === 'proactive' ? 'authorized' : c.resumeStatus });
    }
    navigation.navigate('Decision', { candidateId: c.id });
  };

  const handleRequestResume = (id) => {
    updateCandidate(id, { resumeStatus: 'requested' });
    setToast({ visible: true, message: '已发送简历请求', type: 'info' });
    setTimeout(() => {
      updateCandidate(id, { resumeStatus: 'authorized', hasNewResume: true, newResumeRead: false });
      setToast({ visible: true, message: '候选人已授权简历', type: 'success' });
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.navTitle}>待处理</Text>
        <Text style={styles.counter}>{list.length}位候选人</Text>
      </View>

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>○</Text>
          <Text style={styles.emptyText}>暂无待处理的候选人</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CandidateCard
              candidate={item}
              onPress={() => handleCardPress(item)}
              onRequestResume={handleRequestResume}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9, zIndex: 1 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  counter: { fontSize: 14, color: '#7B838D', fontWeight: '500' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 },
  emptyIcon: { fontSize: 48, opacity: 0.3, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#7B838D' },
});
