import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getResumeStatusLabel, getMatchingStatus } from '../data/candidates';

function QuoteIcon() {
  return (
    <Svg width={14} height={10} viewBox="0 0 14 10" fill="none">
      <Path opacity={0.5} d="M11.2596 0L12.5404 1.19186L10.9319 2.87791C11.2894 3.38178 11.7163 3.90504 12.2128 4.44767C12.7291 4.99031 13.3248 5.56201 14 6.16279C13.4837 6.70543 12.9078 7.24806 12.2723 7.7907C11.6369 8.31395 11.0511 8.75969 10.5149 9.12791C9.81986 8.25581 9.16454 7.37403 8.54894 6.48256C7.93333 5.5717 7.36738 4.67054 6.85106 3.77907C7.5461 3.23643 8.27092 2.63566 9.02553 1.97674C9.8 1.31783 10.5447 0.658914 11.2596 0ZM4.40851 0.872092L5.68936 2.06395L4.08085 3.75C4.4383 4.25388 4.86525 4.77713 5.3617 5.31977C5.87801 5.8624 6.47376 6.43411 7.14894 7.03488C6.63262 7.57752 6.05674 8.12016 5.42128 8.66279C4.78582 9.18605 4.2 9.63178 3.66383 10C2.96879 9.12791 2.31348 8.24612 1.69787 7.35465C1.08227 6.4438 0.516312 5.54264 0 4.65116C0.695035 4.10853 1.41986 3.50775 2.17447 2.84884C2.94894 2.18992 3.69362 1.53101 4.40851 0.872092Z" fill="#DDE2E8" />
    </Svg>
  );
}

// Figma design tokens
const C = {
  black: '#000000',
  grayDeep: '#656D76',
  grayMid: '#7B838D',
  grayLight: '#9EA7B3',
  greenGray: '#9EB3B3',
  grayShadow: '#BBC1C9',
  green: '#02A87E',
  greenText: '#008B68',
  greenDeep: '#598C75',
  greenBubble: '#EBFAF5',
  chatBg: '#F8FAFC',
  yellow: '#E19D16',
  divider: '#F1F2F4',
  btnBg: '#494949',
  btnText: '#D1FFF0',
};

export default function CandidateCard({ candidate, onPress, onRequestResume, hideResume }) {
  const c = candidate;
  const initial = c.name.charAt(0);
  const resumeLabel = getResumeStatusLabel(c);
  const matchStatus = getMatchingStatus(c);
  const [reasonLines, setReasonLines] = useState(2);

  // Resume pill text
  let rText = null;
  if (!hideResume) {
    if (c.hasNewResume) { rText = '新简历'; }
    else if (resumeLabel) { rText = resumeLabel.text; }
  }

  const isPass = c.recruiterDecision === 'pass';

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.7} onPress={onPress}>
      {/* Row 1: Avatar + Name + Resume pill + Role | Button (pending/reject) */}
      <View style={s.top}>
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.avatarT}>{initial}</Text>
          </View>
          {!hideResume && c.hasNewResume && !c.newResumeRead && <View style={s.avatarDot} />}
        </View>
        <View style={s.info}>
          <View style={s.nameRow}>
            <Text style={s.name}>{c.name}</Text>
            {rText && (
              <View style={[s.resumePill, c.hasNewResume && { backgroundColor: '#F2FAFF' }, c.resumeStatus === 'requested' && { backgroundColor: '#FFFBF2' }]}>
                <Text style={[s.resumePillT, c.hasNewResume && { color: '#1690E1' }, c.resumeStatus === 'requested' && { color: '#E19D16' }]}>{rText}</Text>
              </View>
            )}
          </View>
          <View style={s.contactRow}>
            <Text style={s.contactT}>158***9271</Text>
            <Text style={s.contactSep}>|</Text>
            <Text style={s.contactT}>ink***@outlook.com</Text>
          </View>
        </View>
      </View>

      {/* Certificates row */}
      <View style={s.skills}>
        {(c.certificates || ['CET-6', '软件设计师', 'AWS 架构师']).map(sk => (
          <View key={sk} style={s.pill}>
            <Text style={s.pillT}>{sk}</Text>
          </View>
        ))}
      </View>

      {/* For pass cards: reason + divider + status wrapped in gap:8 container */}
      {isPass ? (
        <View style={s.bottomSection}>
          <View style={s.reasonRow}>
            <View style={s.reasonIconArea}>
              <Image source={require('../assets/agent-avatar.png')} style={s.reasonAvatar} />
              <View style={[s.quoteWrap, reasonLines === 1 && { top: 16 }]}><QuoteIcon /></View>
            </View>
            <Text style={s.reasonT} numberOfLines={2} onTextLayout={e => setReasonLines(e.nativeEvent.lines.length)}>
              {c.aiReason}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.bottomRow}>
            {matchStatus ? (
              <View style={s.matchInline}>
                <View style={[s.matchDot, matchStatus.type === 'orange' && { backgroundColor: C.yellow }, matchStatus.type === 'gray' && { backgroundColor: C.grayMid }]} />
                <Text style={[s.matchText, matchStatus.type === 'orange' && { color: '#E19D16' }, matchStatus.type === 'gray' && { color: C.grayMid }]}>{matchStatus.text}</Text>
              </View>
            ) : <View />}
            {c.resumeStatus === 'none' && (
              <TouchableOpacity style={s.reqBtn} onPress={() => onRequestResume?.(c.id)}>
                <Text style={s.reqBtnT}>请求简历</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={s.bottomSection}>
          <View style={s.reasonRow}>
            <View style={s.reasonIconArea}>
              <Image source={require('../assets/agent-avatar.png')} style={s.reasonAvatar} />
              <View style={[s.quoteWrap, reasonLines === 1 && { top: 16 }]}><QuoteIcon /></View>
            </View>
            <Text style={s.reasonT} numberOfLines={2} onTextLayout={e => setReasonLines(e.nativeEvent.lines.length)}>
              {c.aiReason}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.bottomRow}>
            {matchStatus ? (
              <View style={s.matchInline}>
                <View style={[s.matchDot, matchStatus.type === 'orange' && { backgroundColor: C.yellow }, matchStatus.type === 'gray' && { backgroundColor: C.grayMid }]} />
                <Text style={[s.matchText, matchStatus.type === 'orange' && { color: '#E19D16' }, matchStatus.type === 'gray' && { color: C.grayMid }]}>{matchStatus.text}</Text>
              </View>
            ) : <View />}
            {!hideResume && c.resumeStatus === 'none' && (
              <TouchableOpacity style={s.reqBtn} onPress={() => onRequestResume?.(c.id)}>
                <Text style={s.reqBtnT}>请求简历</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 12,
    gap: 16,
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },

  // Top row
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e8e8ed',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarWrap: { position: 'relative' },
  avatarDot: { position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderRadius: 3, backgroundColor: '#F55252' },
  avatarT: { fontSize: 16, fontWeight: '500', color: C.grayShadow },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontSize: 16, fontWeight: '600', color: C.black },
  resumePill: {
    backgroundColor: C.greenBubble,
    borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 1,
  },
  resumePillT: { fontSize: 12, color: C.greenText, letterSpacing: 0.5 },
  role: { fontSize: 13, color: C.grayDeep, letterSpacing: 0.5, marginTop: 6 },

  // Skills
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    backgroundColor: C.chatBg,
    borderRadius: 4,
    paddingHorizontal: 12, paddingVertical: 2,
  },
  pillT: { fontSize: 13, color: C.grayMid, lineHeight: 21 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  contactT: { fontSize: 12, color: C.grayMid, letterSpacing: 0.5 },
  contactSep: { fontSize: 12, color: '#DDE2E8' },

  // AI Reason
  reasonRow: { flexDirection: 'row', alignItems: 'center' },
  reasonIconArea: { position: 'relative', marginRight: 4 },
  reasonAvatar: { width: 20, height: 20, borderRadius: 10 },
  quoteWrap: { position: 'absolute', top: -8, right: -14 },
  reasonT: {
    flex: 1, fontSize: 13, color: C.greenGray,
    letterSpacing: 0.5, lineHeight: 18,
  },

  // Bottom section wrapper
  bottomSection: { gap: 8 },
  divider: { height: 0.5, backgroundColor: C.divider },

  // Bottom row
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchInline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  matchText: { fontSize: 12, color: C.green, letterSpacing: 0.5 },

  // Request resume button
  reqBtn: {
    backgroundColor: C.greenBubble,
    borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  reqBtnT: { fontSize: 14, fontWeight: '500', color: C.greenText, lineHeight: 21 },
});
