import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';


const GRAD_COLORS = { pass: '#8EF1CD', pending: '#F1D88E', reject: '#F1988E' };

const COMPANY_COLORS = {
  '字节跳动': '#1A1A1A', '蚂蚁集团': '#1677FF', '网易': '#D0021B', '拼多多': '#E02E24',
  '阿里巴巴': '#FF6A00', '美团': '#FFD100', '腾讯': '#12B7F5', '京东': '#E1251B',
  '小红书': '#FF2442', '快手': '#FF4906', '华为': '#CF0A2C', '中兴通讯': '#0066CC',
  'B站': '#FB7299', '米哈游': '#1A73E8', '滴滴出行': '#FF8C00', '百度': '#2932E1',
  '小米': '#FF6900', '广告公司': '#888', '创业公司': '#888',
};
const getCompanyColor = (company) => COMPANY_COLORS[company] || '#7B838D';
const getCompanyTextColor = (company) => {
  const bg = getCompanyColor(company);
  if (['美团'].includes(company)) return '#333';
  return '#fff';
};

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
import { useApp } from '../data/AppContext';
import { getMatchingStatus } from '../data/candidates';
import Toast from '../components/Toast';

function QuoteIcon() {
  return (
    <Svg width={14} height={10} viewBox="0 0 14 10" fill="none">
      <Path opacity={0.5} d="M11.2596 0L12.5404 1.19186L10.9319 2.87791C11.2894 3.38178 11.7163 3.90504 12.2128 4.44767C12.7291 4.99031 13.3248 5.56201 14 6.16279C13.4837 6.70543 12.9078 7.24806 12.2723 7.7907C11.6369 8.31395 11.0511 8.75969 10.5149 9.12791C9.81986 8.25581 9.16454 7.37403 8.54894 6.48256C7.93333 5.5717 7.36738 4.67054 6.85106 3.77907C7.5461 3.23643 8.27092 2.63566 9.02553 1.97674C9.8 1.31783 10.5447 0.658914 11.2596 0ZM4.40851 0.872092L5.68936 2.06395L4.08085 3.75C4.4383 4.25388 4.86525 4.77713 5.3617 5.31977C5.87801 5.8624 6.47376 6.43411 7.14894 7.03488C6.63262 7.57752 6.05674 8.12016 5.42128 8.66279C4.78582 9.18605 4.2 9.63178 3.66383 10C2.96879 9.12791 2.31348 8.24612 1.69787 7.35465C1.08227 6.4438 0.516312 5.54264 0 4.65116C0.695035 4.10853 1.41986 3.50775 2.17447 2.84884C2.94894 2.18992 3.69362 1.53101 4.40851 0.872092Z" fill="#DDE2E8" />
    </Svg>
  );
}

export default function CandidateScreen({ navigation, route }) {
  const { getById, updateCandidate } = useApp();
  const c = getById(route.params.candidateId);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  if (!c) return null;

  const initial = c.name.charAt(0);
  const isMale = c.gender === 'male';
  const dec = c.recruiterDecision;
  const matchStatus = getMatchingStatus(c);
  const matchTagStyle = matchStatus?.type === 'green'
    ? { bg: '#EBFAF5', color: '#008B68' }
    : matchStatus?.type === 'orange'
    ? { bg: '#FFFBF2', color: '#E19D16' }
    : matchStatus?.type === 'gray'
    ? { bg: '#DDE2E8', color: '#7B838D' }
    : null;
  const decLabels = { pass: '通过', pending: '待定', reject: '拒绝' };
  const decColors = { pass: '#02A87E', pending: '#E19D16', reject: '#dc2626' };


  // tag颜色与CandidateCard pill完全一致：新简历蓝、有简历绿、已请求黄
  let resumeText = null, resumeTagBg = null, resumeTagColor = null, resumeDotColor = '#BBC1C9', resumeAction = null;
  if (c.resumeStatus === 'none') {
    resumeAction = 'request';
  } else if (c.resumeStatus === 'requested') {
    resumeText = '已请求简历'; resumeTagBg = '#FFFBF2'; resumeTagColor = '#E19D16'; resumeDotColor = '#E19D16'; resumeAction = 'waiting';
  } else if (c.resumeStatus === 'has') {
    resumeText = '有简历'; resumeTagBg = '#EBFAF5'; resumeTagColor = '#008B68'; resumeDotColor = '#02A87E'; resumeAction = 'view';
  } else if (c.resumeStatus === 'authorized' || c.resumeStatus === 'proactive') {
    if (c.hasNewResume && !c.newResumeRead) {
      resumeText = '新简历'; resumeTagBg = '#F2FAFF'; resumeTagColor = '#1690E1'; resumeDotColor = '#1690E1';
    } else {
      resumeText = '有简历'; resumeTagBg = '#EBFAF5'; resumeTagColor = '#008B68'; resumeDotColor = '#02A87E';
    }
    resumeAction = 'view';
  }

  const handleDecision = (decision) => {
    updateCandidate(c.id, { recruiterDecision: decision });
    setSheetOpen(false);
    const labels = { pass: '已通过', pending: '已待定', reject: '已拒绝' };
    setToast({ visible: true, message: `${labels[decision]} · ${c.name}`, type: decision });
  };

  const handleRequestResume = () => {
    updateCandidate(c.id, { resumeStatus: 'requested' });
    setToast({ visible: true, message: '已发送简历请求', type: 'info' });
  };

  const options = [
    { key: 'pass', label: '通过', color: '#02A87E', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)' },
    { key: 'pending', label: '待定', color: '#E19D16', bg: 'rgba(225,157,22,0.08)', border: 'rgba(225,157,22,0.2)' },
    { key: 'reject', label: '拒绝', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)' },
  ];

  const gradColor = dec ? GRAD_COLORS[dec] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
      {gradColor && (
        <View pointerEvents="none" style={styles.gradBg}>
          <Svg width="100%" height={275} preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="candGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={gradColor} stopOpacity="0.5" />
                <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="275" fill="url(#candGrad)" />
          </Svg>
        </View>
      )}

      <View style={styles.nav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.navTitle}>候选人详情</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Top section */}
        <View style={styles.topSection}>
          {/* Profile */}
          <View style={styles.profile}>
            <View style={styles.avatarLg}>
              <Text style={styles.avatarLgT}>{initial}</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={styles.nameLg}>{c.name}</Text>
              <Text style={styles.titleLg}>{c.company} · {c.title}</Text>
            </View>
          </View>


          {/* AI Reason */}
          <View style={styles.aiReasonRow}>
            <View style={styles.aiReasonIconArea}>
              <Image source={require('../assets/agent-avatar.png')} style={styles.aiReasonAvatar} />
              <View style={styles.aiQuoteWrap}><QuoteIcon /></View>
            </View>
            <Text style={styles.aiReasonText}>{c.aiReason}</Text>
          </View>
        </View>

        {/* Bottom white card: resume + work exp */}
        <View style={styles.bottomCard}>
          {/* Resume row */}
          <View style={styles.resumeRow}>
            <View style={styles.resumeLeftCol}>
              {resumeText && (
                <View style={[styles.resumeTag, { backgroundColor: resumeTagBg }]}>
                  <Text style={[styles.resumeTagT, { color: resumeTagColor }]}>{resumeText}</Text>
                </View>
              )}
              {matchStatus && (
                <View style={styles.resumeMatchRow}>
                  <View style={[styles.resumeMatchDot, { backgroundColor: matchStatus.type === 'green' ? '#02A87E' : matchStatus.type === 'orange' ? '#E19D16' : '#7B838D' }]} />
                  <Text style={[styles.resumeMatchT, { color: matchStatus.type === 'green' ? '#02A87E' : matchStatus.type === 'orange' ? '#E19D16' : '#7B838D' }]}>{matchStatus.text}</Text>
                </View>
              )}
            </View>
            {resumeAction === 'request' && (
              <TouchableOpacity style={styles.resumeActionBtn} onPress={handleRequestResume}>
                <Text style={styles.resumeActionBtnT}>请求简历</Text>
              </TouchableOpacity>
            )}
            {resumeAction === 'view' && (
              <TouchableOpacity style={styles.resumeActionBtn}>
                <Text style={styles.resumeActionBtnT}>查看简历</Text>
              </TouchableOpacity>
            )}
            {resumeAction === 'waiting' && (
              <Text style={styles.resumeWaitingT}>等待授权中</Text>
            )}
          </View>

          {/* Skills */}
          {/* Education */}
          <View style={styles.expSection}>
            <View style={styles.expTitleRow}>
              <View style={styles.expTitleBar} />
              <Text style={styles.expTitleText}>教育背景</Text>
            </View>
            <View style={styles.expItem}>
              <View style={styles.expItemTop}>
                <View style={styles.expCompanyLeft}>
                  <View style={[styles.expLogo, { backgroundColor: '#1677FF' }]}>
                    <Text style={[styles.expLogoT, { color: '#fff' }]}>北</Text>
                  </View>
                  <Text style={styles.expCompany}>{c.edu || '本科'} · 计算机科学</Text>
                </View>
                <Text style={styles.expDate}>2016-2020</Text>
              </View>
              <Text style={styles.expRole}>北京大学</Text>
            </View>
          </View>

          {/* Certificates */}
          <View style={styles.expSection}>
            <View style={styles.expTitleRow}>
              <View style={styles.expTitleBar} />
              <Text style={styles.expTitleText}>资格证书</Text>
            </View>
            <View style={styles.skillsRow}>
              {['CET-6', '软件设计师', 'AWS 架构师'].map(cert => (
                <View key={cert} style={styles.skillTag}><Text style={styles.skillTagT}>{cert}</Text></View>
              ))}
            </View>
          </View>

          {/* Work Experience */}
          <View style={styles.expSection}>
            <View style={styles.expTitleRow}>
              <View style={styles.expTitleBar} />
              <Text style={styles.expTitleText}>工作经历</Text>
            </View>
            {(c.workHistory || [{ company: c.company, title: c.title, period: '至今' }]).flatMap((w, i) => [
              i > 0 ? <View key={`d${i}`} style={styles.expDivider} /> : null,
              <View key={i} style={styles.expItem}>
                <View style={styles.expItemTop}>
                  <View style={styles.expCompanyLeft}>
                    <View style={[styles.expLogo, { backgroundColor: getCompanyColor(w.company) }]}>
                      <Text style={[styles.expLogoT, { color: getCompanyTextColor(w.company) }]}>{w.company.charAt(0)}</Text>
                    </View>
                    <Text style={styles.expCompany}>{w.company}</Text>
                  </View>
                  <Text style={styles.expDate}>{w.period}</Text>
                </View>
                <Text style={styles.expRole}>{w.title}</Text>
              </View>,
            ])}
          </View>
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      <TouchableOpacity style={styles.bottomBar} onPress={() => setSheetOpen(true)}>
        <View style={styles.bottomLeft}>
          {dec === 'pass' && (
            <Svg width={20} height={20} viewBox="0 0 32 32" fill="none">
              <Path d="M24 9.3335L12.5714 22.6668L8 17.3335" stroke={decColors.pass} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          )}
          {dec === 'reject' && (
            <Svg width={20} height={20} viewBox="0 0 32 32" fill="none">
              <Path d="M8.92893 9.07107L23.0711 23.2132M23.0711 9.07107L8.92893 23.2132" stroke={decColors.reject} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          )}
          {dec === 'pending' && (
            <Svg width={20} height={20} viewBox="0 0 32 32" fill="none">
              <Circle cx={16} cy={16} r={8} stroke={decColors.pending} strokeWidth={2} />
            </Svg>
          )}
          <Text style={[styles.bottomText, dec && { color: decColors[dec] }]}>{dec ? decLabels[dec] : '选择决策'}</Text>
        </View>
        <View style={styles.bottomArrow}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx={6} cy={12} r={1.25} fill="#7B838D" stroke="#7B838D" strokeWidth={0.5} />
            <Circle cx={12} cy={12} r={1.25} fill="#7B838D" stroke="#7B838D" strokeWidth={0.5} />
            <Circle cx={18} cy={12} r={1.25} fill="#7B838D" stroke="#7B838D" strokeWidth={0.5} />
          </Svg>
        </View>
      </TouchableOpacity>

      {/* Decision Sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSheetOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>选择决策</Text>
            {options.map(o => (
              <TouchableOpacity
                key={o.key}
                style={[styles.option, { borderColor: dec === o.key ? o.border : '#F1F2F4' }, dec === o.key && { backgroundColor: o.bg }]}
                onPress={() => handleDecision(o.key)}
              >
                <View style={styles.optionLeft}>
                  {o.key === 'pass' && <Svg width={20} height={20} viewBox="0 0 32 32" fill="none"><Path d="M24 9.3335L12.5714 22.6668L8 17.3335" stroke={o.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                  {o.key === 'reject' && <Svg width={20} height={20} viewBox="0 0 32 32" fill="none"><Path d="M8.92893 9.07107L23.0711 23.2132M23.0711 9.07107L8.92893 23.2132" stroke={o.color} strokeWidth={2} strokeLinecap="round" /></Svg>}
                  {o.key === 'pending' && <Svg width={20} height={20} viewBox="0 0 32 32" fill="none"><Circle cx={16} cy={16} r={8} stroke={o.color} strokeWidth={2} /></Svg>}
                  <Text style={[styles.optionLabel, { color: o.color }, dec === o.key && { fontWeight: '600' }]}>{o.label}</Text>
                </View>
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
  safe: { flex: 1, backgroundColor: '#FBFBFB', position: 'relative' },
  gradBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 275, zIndex: 0 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9, zIndex: 1 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },
  topSection: { flexDirection: 'column', gap: 20, paddingHorizontal: 16, paddingTop: 16 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarLg: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8e8ed', alignItems: 'center', justifyContent: 'center' },
  avatarLgT: { fontSize: 18, fontWeight: '500', color: '#BBC1C9' },
  nameLg: { fontSize: 20, fontWeight: '500', color: '#000', letterSpacing: 0.5 },
  titleLg: { fontSize: 13, color: '#656D76', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  statCol: { flex: 1, alignItems: 'center', gap: 0 },
  statVal: { fontSize: 14, fontWeight: '500', color: '#000', lineHeight: 21, textAlign: 'center' },
  statLabel: { fontSize: 12, color: '#9EA7B3', letterSpacing: 0.5 },
  expLg: { fontSize: 12, color: '#BBC1C9', marginTop: 2 },
  section: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
  },
  secTitle: { fontSize: 12, fontWeight: '600', color: '#008B68', marginBottom: 10, letterSpacing: 0.5 },
  expSection: { gap: 16 },
  expTitleRow: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  expTitleBar: { width: 4, borderRadius: 999, backgroundColor: '#6FCDAE' },
  expTitleText: { fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 },
  expItem: { gap: 4, paddingLeft: 12 },
  expItemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 21 },
  expCompanyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expLogo: { width: 21, height: 21, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  expLogoT: { fontSize: 10, fontWeight: '600' },
  expCompany: { fontSize: 14, fontWeight: '500', color: '#000', lineHeight: 21 },
  expDate: { fontSize: 12, fontWeight: '300', color: '#78787D', lineHeight: 21 },
  expRole: { fontSize: 13, fontWeight: '400', color: '#000', letterSpacing: 0.5, lineHeight: 18, paddingLeft: 29 },
  expDivider: { height: 0.5, backgroundColor: '#F1F2F4', marginLeft: 12 },
  aiReasonRow: { flexDirection: 'row', alignItems: 'center' },
  aiReasonIconArea: { position: 'relative', marginRight: 4 },
  aiReasonAvatar: { width: 20, height: 20, borderRadius: 10 },
  aiQuoteWrap: { position: 'absolute', top: -8, right: -14 },
  aiReasonText: { flex: 1, fontSize: 13, color: '#9EB3B3', letterSpacing: 0.5, lineHeight: 18 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: { paddingHorizontal: 12, paddingVertical: 2, borderRadius: 4, backgroundColor: '#F6F7F9' },
  skillTagT: { fontSize: 12, color: '#7B838D', letterSpacing: 0.5, lineHeight: 18 },
  bottomCard: {
    paddingHorizontal: 16, gap: 28, marginTop: 20,
    flexGrow: 1, paddingBottom: 40,
  },
  resumeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 4, paddingBottom: 16,
  },
  resumeLeftCol: { flexDirection: 'column', gap: 3 },
  resumeTag: { backgroundColor: '#EBFAF5', borderRadius: 999, paddingHorizontal: 4, paddingVertical: 2, height: 18, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' },
  resumeTagT: { fontSize: 10, color: '#009688', letterSpacing: 0.5 },
  resumeMatchRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resumeMatchDot: { width: 4, height: 4, borderRadius: 2 },
  resumeMatchT: { fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  resumeActionBtn: { backgroundColor: '#EBFAF5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  resumeActionBtnT: { fontSize: 14, fontWeight: '500', color: '#008B68', lineHeight: 21 },
  resumeWaitingT: { fontSize: 13, color: '#BBC1C9' },
  waitingText: { fontSize: 13, color: '#BBC1C9' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 14, color: '#7B838D' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#000' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 34, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F4F4F4' },
  bottomLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bottomDot: { width: 8, height: 8, borderRadius: 4 },
  bottomText: { fontSize: 16, fontWeight: '600', color: '#000' },
  bottomArrow: { alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingBottom: 34, overflow: 'hidden' },
  sheetGradBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#DDE2E8', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetTitle: { textAlign: 'center', fontSize: 13, color: '#BBC1C9', paddingVertical: 10 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 8, borderWidth: 0.5, borderColor: '#F1F2F4' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionDot: { width: 10, height: 10, borderRadius: 5 },
  optionLabel: { fontSize: 16, fontWeight: '500' },
  optionCheck: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cancel: { padding: 14, borderRadius: 16, backgroundColor: '#F1F2F4', alignItems: 'center', marginTop: 8 },
  cancelText: { fontSize: 15, color: '#7B838D' },
});
