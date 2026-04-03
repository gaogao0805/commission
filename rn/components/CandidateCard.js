import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getResumeStatusLabel, getMatchingStatus } from '../data/candidates';

// Figma design tokens
const C = {
  black: '#000000',
  grayDeep: '#656D76',    // 灰蓝色深文本
  grayMid: '#7B838D',     // 灰蓝色中深文本
  grayLight: '#9EA7B3',   // 灰蓝色中浅文本
  greenGray: '#9EB3B3',   // 绿灰icon/AI理由文本
  grayShadow: '#BBC1C9',  // 占位符阴影
  green: '#02A87E',       // 主绿
  greenDeep: '#598C75',   // 稍浅深绿
  greenBubble: '#EBFAF5', // 浅绿气泡
  chatBg: '#F8FAFC',      // 聊天气泡/技能背景
  yellow: '#E19D16',
};

export default function CandidateCard({ candidate, onPress, onRequestResume }) {
  const c = candidate;
  const initial = c.name.charAt(0);
  const isHighlight = c.hasNewResume && !c.newResumeRead;
  const resumeLabel = getResumeStatusLabel(c);
  const matchStatus = getMatchingStatus(c);

  // Resume inline: green dot + text
  let rText = null, rColor = C.green;
  if (isHighlight) { rText = '新简历'; }
  else if (resumeLabel) {
    rText = resumeLabel.text;
    rColor = resumeLabel.type === 'requested' ? C.yellow : C.green;
  }

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.7} onPress={onPress}>
      {/* Match status tag - top right, pill left-rounded */}
      {matchStatus && (
        <View style={s.msWrap}>
          <Text style={s.msText}>{matchStatus.text}</Text>
        </View>
      )}

      {/* Row 1: Avatar + Name + Resume + Role */}
      <View style={s.top}>
        <View style={s.avatar}>
          <Text style={s.avatarT}>{initial}</Text>
          {isHighlight && <View style={s.redDot} />}
        </View>
        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{c.name}</Text>
            {rText && (
              <View style={s.resumeInline}>
                <View style={[s.dot, { backgroundColor: rColor }]} />
                <Text style={[s.rText, { color: rColor }]}>{rText}</Text>
              </View>
            )}
          </View>
          <Text style={s.role}>{c.company} / {c.title}</Text>
        </View>
      </View>

      {/* Skills row */}
      <View style={s.skills}>
        {c.skills.map(sk => (
          <View key={sk} style={s.pill}>
            <Text style={s.pillT}>{sk}</Text>
          </View>
        ))}
      </View>

      {/* AI Reason with avatar + quote */}
      <View style={s.reasonRow}>
        <View style={s.reasonLeft}>
          <Text style={s.quote}>{'\u201C'}</Text>
          <View style={s.reasonAvatar} />
        </View>
        <Text style={s.reasonT} numberOfLines={2}>
          {c.aiReason}
        </Text>
      </View>

      {/* Request resume if none */}
      {c.resumeStatus === 'none' && (
        <TouchableOpacity style={s.reqBtn} onPress={() => onRequestResume?.(c.id)}>
          <Text style={s.reqBtnT}>请求简历</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    // subtle shadow
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },

  // Match status tag - positioned top right, left-side rounded pill
  msWrap: {
    position: 'absolute', top: 12, right: 0,
    backgroundColor: C.greenBubble,
    borderTopLeftRadius: 999, borderBottomLeftRadius: 999,
    paddingLeft: 12, paddingRight: 8, paddingVertical: 1,
  },
  msText: { fontSize: 12, color: C.greenDeep, letterSpacing: 0.5 },

  // Top row
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e8e8ed',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarT: { fontSize: 16, fontWeight: '500', color: C.grayShadow },
  redDot: {
    position: 'absolute', top: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#dc2626', borderWidth: 2, borderColor: '#fff',
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontSize: 16, fontWeight: '600', color: C.black },
  resumeInline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  rText: { fontSize: 12, letterSpacing: 0.5 },
  role: { fontSize: 13, color: C.grayDeep, letterSpacing: 0.5, marginTop: 6 },

  // Skills
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  pill: {
    backgroundColor: C.chatBg,
    borderRadius: 4,
    paddingHorizontal: 12, paddingVertical: 2,
  },
  pillT: { fontSize: 12, color: C.grayMid, letterSpacing: 0.5, lineHeight: 18 },

  // AI Reason
  reasonRow: { flexDirection: 'row', marginTop: 16 },
  reasonLeft: { alignItems: 'center', marginRight: 4, width: 24 },
  quote: { fontSize: 14, color: C.greenGray, lineHeight: 14 },
  reasonAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.green, marginTop: 2 },
  reasonT: {
    flex: 1, fontSize: 13, color: C.greenGray,
    letterSpacing: 0.5, lineHeight: 18,
  },

  // Request resume button
  reqBtn: {
    marginTop: 12, alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4,
    backgroundColor: C.greenBubble,
  },
  reqBtnT: { fontSize: 12, fontWeight: '500', color: C.green, letterSpacing: 0.5 },
});
