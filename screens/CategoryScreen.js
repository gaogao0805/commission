import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../data/AppContext';
import CandidateCard from '../components/CandidateCard';
import Toast from '../components/Toast';

const TABS = [
  { key: 'pass', label: '通过' },
  { key: 'pending', label: '待定' },
  { key: 'reject', label: '拒绝' },
];

export default function CategoryScreen({ navigation, route }) {
  const { getPassed, getPending, getRejected, updateCandidate } = useApp();
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'pass');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const getList = () => {
    if (activeTab === 'pass') return getPassed();
    if (activeTab === 'pending') return getPending();
    return getRejected();
  };

  const counts = { pass: getPassed().length, pending: getPending().length, reject: getRejected().length };

  const handleCardPress = (c) => {
    if (c.hasNewResume && !c.newResumeRead) {
      updateCandidate(c.id, { newResumeRead: true, hasNewResume: false, resumeStatus: c.resumeStatus === 'proactive' ? 'authorized' : c.resumeStatus });
    }
    navigation.navigate('Candidate', { candidateId: c.id });
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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>候选人管理</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => setActiveTab(tab.key)}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
              <Text style={[styles.tabCount, activeTab === tab.key && styles.tabCountActive]}> {counts[tab.key]}</Text>
            </Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
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
  safe: { flex: 1, backgroundColor: '#f2f2f7' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#1a1a2e', marginTop: -2 },
  navTitle: { fontSize: 17, fontWeight: '600', color: '#1a1a2e' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, gap: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)', marginTop: 8 },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#9ca3af' },
  tabTextActive: { color: '#1a1a2e' },
  tabCount: { fontSize: 11, backgroundColor: '#f0f0f5', color: '#6b7280', borderRadius: 9, overflow: 'hidden', paddingHorizontal: 5 },
  tabCountActive: { backgroundColor: 'rgba(99,102,241,0.08)', color: '#4f46e5' },
  tabIndicator: { position: 'absolute', bottom: -1, width: 24, height: 2, backgroundColor: '#6366f1', borderRadius: 1 },
  listContent: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 },
  emptyIcon: { fontSize: 48, opacity: 0.3, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});
