import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getResumeStatusLabel, getMatchingStatus } from '../data/candidates';

export default function CandidateCard({ candidate, onPress, onRequestResume }) {
  const c = candidate;
  const initial = c.name.charAt(0);
  const isHighlight = c.hasNewResume && !c.newResumeRead;
  const resumeLabel = getResumeStatusLabel(c);
  const matchStatus = getMatchingStatus(c);

  // Resume inline tag
  let rText = null, rColor = '#059669';
  if (isHighlight) { rText = '新简历'; rColor = '#059669'; }
  else if (resumeLabel) { rText = resumeLabel.text; rColor = resumeLabel.type === 'requested' ? '#d97706' : '#059669'; }

  // Match status colors
  const msColor = matchStatus?.type === 'green' ? '#059669' : matchStatus?.type === 'orange' ? '#d97706' : '#9ca3af';
  const msBg = matchStatus?.type === 'green' ? 'rgba(5,150,105,0.06)' : matchStatus?.type === 'orange' ? 'rgba(217,119,6,0.06)' : 'rgba(0,0,0,0.03)';

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.7} onPress={onPress}>
      {/* Row 1: avatar + name/title + match tag */}
      <View style={s.top}>
        <View style={s.avatar}>
          <Text style={s.avatarT}>{initial}</Text>
          {isHighlight && <View style={s.redDot} />}
        </View>
        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{c.name}</Text>
            {rText && <>
              <View style={[s.dot, { backgroundColor: rColor }]} />
              <Text style={[s.rText, { color: rColor }]}>{rText}</Text>
            </>}
          </View>
          <Text style={s.role}>{c.company} / {c.title}</Text>
        </View>
        {matchStatus && (
          <View style={[s.msTag, { backgroundColor: msBg, borderColor: msColor + '30' }]}>
            <Text style={[s.msText, { color: msColor }]}>{matchStatus.text}</Text>
          </View>
        )}
      </View>

      {/* Skills */}
      <View style={s.skills}>
        {c.skills.map(sk => <View key={sk} style={s.pill}><Text style={s.pillT}>{sk}</Text></View>)}
      </View>

      {/* AI Reason */}
      <View style={s.reason}>
        <Text style={s.reasonT} numberOfLines={2}>{c.aiReason}</Text>
      </View>

      {/* Request resume button if none */}
      {c.resumeStatus === 'none' && (
        <TouchableOpacity style={s.reqBtn} onPress={() => onRequestResume?.(c.id)}>
          <Text style={s.reqBtnT}>请求简历</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 0.5, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f0f5', alignItems: 'center', justifyContent: 'center' },
  avatarT: { fontSize: 17, fontWeight: '500', color: '#9ca3af' },
  redDot: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#dc2626', borderWidth: 2, borderColor: '#fff' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  rText: { fontSize: 13, fontWeight: '500' },
  role: { fontSize: 13, color: '#6b7280', marginTop: 3 },
  msTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  msText: { fontSize: 11, fontWeight: '500' },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, paddingTop: 4, borderTopWidth: 0.5, borderTopColor: '#f0f0f5' },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, backgroundColor: '#f7f7fb', borderWidth: 0.5, borderColor: '#e5e7eb' },
  pillT: { fontSize: 13, color: '#4b5563' },
  reason: { borderLeftWidth: 3, borderLeftColor: '#059669', paddingLeft: 12 },
  reasonT: { fontSize: 13, color: '#4b5563', lineHeight: 20 },
  reqBtn: { marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.06)' },
  reqBtnT: { fontSize: 12, fontWeight: '500', color: '#4f46e5' },
});
