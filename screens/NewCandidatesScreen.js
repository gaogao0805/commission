import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../data/AppContext';
import CandidateCard from '../components/CandidateCard';
import WarmBg from '../components/WarmBg';

export default function NewCandidatesScreen({ navigation }) {
  const { getNew } = useApp();
  const list = getNew();

  const handleCardPress = (c) => {
    navigation.navigate('Decision', { candidateId: c.id });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <WarmBg />
      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.navTitle}>待处理 · {list.length}</Text>
        <View style={{ width: 24 }} />
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
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CandidateCard
              candidate={item}
              onPress={() => handleCardPress(item)}
              hideResume
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB', position: 'relative' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9, zIndex: 1 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60 },
  emptyIcon: { fontSize: 48, opacity: 0.3, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#7B838D' },
});
