import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../data/AppContext';
import Toast from '../components/Toast';

export default function CandidateScreen({ navigation, route }) {
  const { getById, updateCandidate } = useApp();
  const c = getById(route.params.candidateId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  if (!c) return null;

  const initial = c.name.charAt(0);
  const isMale = c.gender === 'male';
  const dec = c.recruiterDecision;
  const decLabels = { pass: '通过', pending: '待定', reject: '拒绝' };
  const decColors = { pass: '#059669', pending: '#d97706', reject: '#dc2626' };

  let resumeText = '暂无简历', resumeDotColor = '#9ca3af', resumeAction = null;
  if (c.resumeStatus === 'none') {
    resumeAction = 'request';
  } else if (c.resumeStatus === 'requested') {
    resumeText = '已请求简历'; resumeDotColor = '#3b82f6'; resumeAction = 'waiting';
  } else if (c.resumeStatus === 'has' || c.resumeStatus === 'authorized') {
    resumeText = '有简历'; resumeDotColor = '#6366f1'; resumeAction = 'view';
  } else if (c.resumeStatus === 'proactive') {
    resumeText = c.hasNewResume && !c.newResumeRead ? '新简历' : '有简历';
    resumeDotColor = c.hasNewResume ? '#059669' : '#6366f1'; resumeAction = 'view';
  }

  const handleDecision = (decision) => {
    updateCandidate(c.id, { recruiterDecision: decision });
    setSheetOpen(false);
    const labels = { pass: '已通过', pending: '已待定', reject: '已拒绝' };
    setToast({ visible: true, message: `${labels[decision]} · ${c.name}`, type: decision === 'pass' ? 'success' : 'info' });
  };

  const handleRequestResume = () => {
    updateCandidate(c.id, { resumeStatus: 'requested' });
    setToast({ visible: true, message: '已发送简历请求', type: 'info' });
  };

  const options = [
    { key: 'pass', label: '通过', color: '#059669', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)' },
    { key: 'pending', label: '待定', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' },
    { key: 'reject', label: '拒绝', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />

      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>候选人详情</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile */}
        <View style={styles.profile}>
          <View style={[styles.avatarLg, { backgroundColor: isMale ? '#dbeafe' : '#f3e8ff' }]}>
            <Text style={[styles.avatarLgT, { color: isMale ? '#2563eb' : '#7c3aed' }]}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.nameLg}>{c.name}</Text>
            <Text style={styles.titleLg}>{c.title} · {c.company}</Text>
            <Text style={styles.expLg}>{c.exp}经验 · {c.location}</Text>
          </View>
        </View>

        {/* AI Reason */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>AI 推荐理由</Text>
          <View style={styles.reasonBox}><Text style={styles.reasonText}>{c.aiReason}</Text></View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>技能标签</Text>
          <View style={styles.skillsRow}>
            {c.skills.map(s => <View key={s} style={styles.skillTag}><Text style={styles.skillTagT}>{s}</Text></View>)}
          </View>
        </View>

        {/* Resume */}
        <View style={styles.resumeSection}>
          <View style={styles.resumeLeft}>
            <View style={[styles.resumeDot, { backgroundColor: resumeDotColor }]} />
            <Text style={styles.resumeText}>{resumeText}</Text>
          </View>
          {resumeAction === 'request' && (
            <TouchableOpacity style={styles.resumeReqBtn} onPress={handleRequestResume}>
              <Text style={styles.resumeReqBtnT}>请求简历</Text>
            </TouchableOpacity>
          )}
          {resumeAction === 'view' && (
            <TouchableOpacity style={styles.resumeViewBtn}>
              <Text style={styles.resumeViewBtnT}>查看简历</Text>
            </TouchableOpacity>
          )}
          {resumeAction === 'waiting' && <Text style={styles.waitingText}>等待授权中</Text>}
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>基本信息</Text>
          {[['工作年限', c.exp], ['所在城市', c.location], ['求职状态', '积极求职中']].map(([l, v], i) => (
            <View key={l} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l}</Text>
              <Text style={[styles.infoValue, i === 2 && { color: '#059669' }]}>{v}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <TouchableOpacity style={styles.bottomBar} onPress={() => setSheetOpen(true)}>
        <View style={styles.bottomLeft}>
          {dec && <View style={[styles.bottomDot, { backgroundColor: decColors[dec] }]} />}
          <Text style={[styles.bottomText, dec && { color: decColors[dec] }]}>{dec ? decLabels[dec] : '选择决策'}</Text>
        </View>
        <Text style={styles.bottomArrow}>▲</Text>
      </TouchableOpacity>

      {/* Decision Sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSheetOpen(false)}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>选择决策</Text>
            {options.map(o => (
              <TouchableOpacity
                key={o.key}
                style={[styles.option, dec === o.key && { backgroundColor: o.bg, borderColor: o.border }]}
                onPress={() => handleDecision(o.key)}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionDot, { backgroundColor: o.color }]} />
                  <Text style={[styles.optionLabel, { color: o.color }, dec === o.key && { fontWeight: '600' }]}>{o.label}</Text>
                </View>
                {dec === o.key && <View style={[styles.optionCheck, { backgroundColor: o.color }]}><Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text></View>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancel} onPress={() => setSheetOpen(false)}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f2f7' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#1a1a2e', marginTop: -2 },
  navTitle: { fontSize: 17, fontWeight: '600' },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 16 },
  avatarLg: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarLgT: { fontSize: 24, fontWeight: '600' },
  nameLg: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  titleLg: { fontSize: 13, color: '#6b7280' },
  expLg: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', borderRadius: 10, padding: 14, paddingHorizontal: 16 },
  secTitle: { fontSize: 12, fontWeight: '600', color: '#4f46e5', marginBottom: 10 },
  reasonBox: { padding: 12, backgroundColor: 'rgba(99,102,241,0.04)', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#6366f1' },
  reasonText: { fontSize: 14, color: '#1a1a2e', lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillTag: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8, backgroundColor: '#f0f0f5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  skillTagT: { fontSize: 13, color: '#6b7280' },
  resumeSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', borderRadius: 10, padding: 14, paddingHorizontal: 16 },
  resumeLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resumeDot: { width: 10, height: 10, borderRadius: 5 },
  resumeText: { fontSize: 15, fontWeight: '500', color: '#1a1a2e' },
  resumeReqBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(99,102,241,0.08)', borderWidth: 1, borderColor: '#6366f1' },
  resumeReqBtnT: { fontSize: 13, fontWeight: '600', color: '#4f46e5' },
  resumeViewBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10, backgroundColor: '#6366f1' },
  resumeViewBtnT: { fontSize: 13, fontWeight: '600', color: '#fff' },
  waitingText: { fontSize: 13, color: '#9ca3af' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14, color: '#6b7280' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#1a1a2e' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 34, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  bottomLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bottomDot: { width: 8, height: 8, borderRadius: 4 },
  bottomText: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  bottomArrow: { fontSize: 12, color: '#9ca3af', width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f5', textAlign: 'center', lineHeight: 28 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingBottom: 34 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#ddd', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetTitle: { textAlign: 'center', fontSize: 13, color: '#9ca3af', paddingVertical: 10 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionDot: { width: 10, height: 10, borderRadius: 5 },
  optionLabel: { fontSize: 16, fontWeight: '500' },
  optionCheck: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cancel: { padding: 14, borderRadius: 14, backgroundColor: '#f0f0f5', alignItems: 'center', marginTop: 8 },
  cancelText: { fontSize: 15, color: '#6b7280' },
});
