import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient as SvgLG, Stop, Rect } from 'react-native-svg';
import { useApp } from '../data/AppContext';
import { jobDetails, hiringPreferences } from '../data/candidates';

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M14.0713 5L7.15073 11.9206C7.06761 12.0037 7.06761 12.1385 7.15073 12.2216L14.0713 19.1421" stroke="black" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const WaveDecoration = () => (
  <Svg width="100%" height={90} viewBox="0 0 426.914 89.947" fill="none" preserveAspectRatio="none">
    <G opacity={0.1}>
      <Path d="M2.78914 0.446953C18.0642 8.10668 31.5974 18.8311 42.5451 31.9515C58.68 51.5294 57.8023 63.5237 73.2996 74.7078C88.3619 85.5694 109.035 88.5623 125.807 84.4592C148.693 78.8559 149.728 63.6062 179.065 39.4526C196.318 25.2606 228.67 -1.38331 266.828 1.19706C286.106 2.50225 305.272 11.1585 323.087 19.1997C344.923 29.0561 348.058 34.1194 359.842 36.4522C373.839 39.2276 395.48 37.2548 426.602 12.4487" stroke="#A48341" strokeMiterlimit="10"/>
      <Path d="M2.36172 3.25221C16.126 9.98138 28.5344 19.186 38.9672 30.4062C39.9648 31.4938 40.9625 32.6115 41.9676 33.7592C58.2675 52.7219 57.6224 64.1761 72.9247 75.0827C79.5949 79.8553 87.1474 83.2541 95.143 85.0816C100.87 86.3854 106.744 86.9302 112.613 86.7019C117.002 86.5288 121.358 85.862 125.598 84.7141C130.322 83.4997 134.813 81.5127 138.89 78.8332C146.391 73.8825 151.641 67.199 159.72 58.8128C165.806 52.5014 172.426 46.7289 179.508 41.5603C183.259 38.7849 187.639 35.4394 192.703 32.0114C206.25 22.8151 223.585 12.8236 244.385 9.3731C251.443 8.16877 258.615 7.76616 265.763 8.17293C266.859 8.23294 267.946 8.32295 269.019 8.42797C279.64 9.45562 289.759 12.1785 300.096 15.794C307.83 18.4644 315.143 21.7949 322.397 24.9229C325.435 26.2581 328.15 27.4732 330.603 28.6134C345.418 35.5219 349.266 39.2275 359.385 40.8477C367.073 42.0779 377.02 41.8603 389.644 37.4797C399.996 33.8942 412.253 27.4357 426.602 16.7542" stroke="#A48341" strokeMiterlimit="10"/>
      <Path d="M1.96419 6.07263C15.5859 12.5475 27.9179 21.4432 38.3596 32.3265C39.3597 33.3766 40.3599 34.4518 41.36 35.5519C57.8625 53.9071 57.4649 64.8062 72.5572 75.4577C79.2433 80.2927 86.8198 83.7571 94.8505 85.6517C100.611 86.964 106.524 87.4889 112.426 87.212C116.821 86.9879 121.174 86.2323 125.388 84.9616C130.089 83.6029 134.555 81.5364 138.635 78.8332C146.436 73.7325 151.971 67.2666 159.96 59.4354C166.074 53.4916 172.771 48.179 179.951 43.5781C183.701 41.1177 187.984 38.1023 192.995 35.1169C206.347 27.1582 222.624 18.8095 243.215 16.0866C250.329 15.1065 257.518 14.7851 264.691 15.1265C265.801 15.1865 266.896 15.2615 267.976 15.359C278.778 16.3041 288.642 18.637 299.188 21.8549C307.132 24.2853 314.378 27.5558 321.692 30.6387C324.73 31.9139 327.475 33.0766 329.988 34.1642C344.848 40.6227 348.831 44.0282 358.912 45.2283C366.593 46.1435 376.465 45.6409 389.157 41.2078C399.523 37.5772 411.938 31.2388 426.602 21.0748" stroke="#A48341" strokeMiterlimit="10"/>
      <Path d="M1.4916 8.84814C15.0019 15.0778 27.2836 23.6831 37.752 34.2543C38.7496 35.2745 39.7548 36.3096 40.7524 37.3673C57.4724 55.1074 57.2849 65.4664 72.1746 75.8329C79.2257 80.7386 86.1717 84.2716 94.5354 86.2294C100.335 87.5525 106.291 88.0575 112.231 87.7296C116.635 87.4528 120.984 86.6056 125.17 85.2093C129.85 83.7073 134.298 81.5614 138.387 78.8334C146.473 73.5826 152.287 67.3492 160.193 60.0806C166.341 54.5013 173.12 49.6602 180.393 45.656C184.181 43.5107 188.337 40.8253 193.288 38.2824C206.512 31.4864 221.664 24.833 242.045 22.8227C249.215 22.0697 256.429 21.8315 263.633 22.1101C264.751 22.1626 265.883 22.2301 266.934 22.3201C277.532 23.1881 288.022 25.0746 298.258 27.9534C306.412 30.1362 313.598 33.3767 321.002 36.3772C324.04 37.6073 326.808 38.71 329.388 39.7451C344.285 45.746 348.411 48.8365 358.447 49.6391C366.128 50.2542 375.947 49.4441 388.684 44.9584C399.073 41.3279 411.623 35.0345 426.602 25.3506" stroke="#A48341" strokeMiterlimit="10"/>
      <Path d="M1.05645 11.6458C14.4362 17.6333 26.6531 25.9371 37.1443 36.1744C38.142 37.1645 39.1546 38.1547 40.1448 39.1748C57.0448 56.3298 57.1198 66.0813 71.7995 76.2152C79.008 81.1735 85.7215 84.804 94.2353 86.8068C100.068 88.1428 106.064 88.6254 112.035 88.2395C116.46 87.9186 120.817 86.982 124.982 85.4566C129.631 83.8235 134.056 81.6134 138.154 78.8781C146.526 73.4698 152.654 67.4915 160.448 60.718C165.946 55.9473 172.449 51.7767 180.858 47.7261C184.676 45.8808 188.742 43.518 193.61 41.4252C206.782 35.7618 220.734 30.8486 240.867 29.5509C248.083 29.0187 255.321 28.861 262.553 29.0784C263.685 29.1234 264.803 29.1834 265.876 29.2584C276.493 29.9545 287.033 31.5505 297.38 34.0291C305.759 35.9644 312.84 39.1823 320.319 42.0778C323.319 43.2629 326.162 44.3281 328.803 45.2957C343.73 50.8765 347.998 53.6144 358.005 54.012C365.686 54.3195 375.437 53.2169 388.227 48.6862C398.616 45.0032 411.315 38.8223 426.602 29.6334" stroke="#A48341" strokeMiterlimit="10"/>
      <Path d="M0.629027 14.4441C13.8751 20.1934 26.0243 28.1956 36.5369 38.095C37.5345 39.0477 38.5472 39.9928 39.5373 40.9679C56.6399 57.4704 56.9474 66.7342 71.4096 76.5831C78.7756 81.6014 85.2566 85.3294 93.9129 87.3772C99.7846 88.7248 105.825 89.1849 111.833 88.7424C116.258 88.3752 120.604 87.3513 124.727 85.7045C129.348 83.9334 133.754 81.646 137.862 78.886C146.526 73.3352 152.977 67.6343 160.643 61.3559C166.306 56.7352 172.952 53.1047 181.263 49.7892C185.126 48.244 189.102 46.2187 193.865 44.5385C207.09 39.9628 219.759 36.8348 239.682 36.2348C246.606 36.0247 254.264 35.7622 261.473 36.0097C262.62 36.0472 263.723 36.0997 264.818 36.1597C275.439 36.6835 286.006 37.9872 296.436 40.0603C305.024 41.7481 312.053 44.9435 319.614 47.7789C322.652 48.9191 325.48 49.9017 328.188 50.8319C343.145 56.0301 347.578 58.5805 357.517 58.423C365.198 58.303 374.89 57.0203 387.724 52.4221C398.121 48.6716 410.978 42.6182 426.572 33.9319" stroke="#A48341" strokeMiterlimit="10"/>
      <Path d="M0.193877 17.2342C13.3088 22.7512 25.3922 30.4542 35.9292 40.015C36.9268 40.9301 37.947 41.8378 38.9296 42.7679C56.2422 58.6702 56.7823 67.364 71.0269 76.9579C78.528 82.0211 84.7915 85.8542 93.6053 87.9545C99.5045 89.3052 105.576 89.7428 111.608 89.2522C116.048 88.8338 120.394 87.72 124.487 85.9517C129.071 84.0349 133.455 81.6733 137.577 78.9007C146.526 73.1923 153.329 67.739 160.83 61.9857C166.666 57.485 173.462 54.4396 181.661 51.8517C185.584 50.6065 189.852 49.8864 194.113 47.7186C207.937 47.141 218.814 41.7177 238.459 42.9929C245.398 43.4505 253.176 42.8129 260.355 42.9929C261.518 43.0304 262.643 43.0679 263.723 43.1204C275.29 43.668 284.141 44.3056 295.483 46.1209C304.282 47.5536 311.235 50.7341 318.879 53.4795C321.879 54.5746 324.767 55.5048 327.543 56.3824C342.507 61.1231 347.098 63.1334 357.022 62.7583C364.711 62.4508 374.342 60.7555 387.221 56.1198C397.633 52.3693 410.625 46.3684 426.542 38.1847" stroke="#A48341" strokeMiterlimit="10"/>
    </G>
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

      {/* Gradient strip — fixed decoration behind scroll content */}
      <View pointerEvents="none" style={styles.gradStrip}>
        <Svg width="100%" height={345} viewBox="0 0 100 345" preserveAspectRatio="none">
          <Defs>
            <SvgLG id="gstrip" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFF7F0" stopOpacity="0" />
              <Stop offset="1" stopColor="#FFEEDE" stopOpacity="1" />
            </SvgLG>
          </Defs>
          <Rect x="0" y="0" width="100" height="345" fill="url(#gstrip)" />
        </Svg>
      </View>

      {/* Top warm section — fixed */}
      <View style={styles.topSection}>
        <Text style={styles.aiStatus}>AI持续为您匹配优质候选人中……</Text>
        <View style={styles.pendSection}>
          <View style={styles.waveWrap} pointerEvents="none">
            <WaveDecoration />
          </View>
          <TouchableOpacity style={styles.pendRow} activeOpacity={0.8} onPress={() => newCount > 0 && navigation.navigate('NewCandidates')}>
            <Text style={styles.pendLabel}>待处理</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.pendCount}>{newCount}</Text>
              <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <Path d="M5 3L8 6L5 9L5 3Z" fill="#A48341" stroke="#A48341" strokeLinejoin="round" />
              </Svg>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {[
            { label: '通过', count: passCount, tab: 'pass' },
            { label: '待定', count: pendCount, tab: 'pending' },
            { label: '拒绝', count: rejCount, tab: 'reject' },
          ].map(item => (
            <TouchableOpacity key={item.tab} style={styles.statCol} onPress={() => navigation.navigate('Category', { initialTab: item.tab })}>
              <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.statNum}>{item.count}</Text>
                <Svg style={{ position: 'absolute', left: '100%' }} width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <Path d="M5 3L8 6L5 9L5 3Z" fill="#BBC1C9" stroke="#BBC1C9" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* White rounded container — stretches to bottom, internal scroll */}
      <View style={styles.bottomCard}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
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
          <View style={styles.prefCard}>
            <View style={styles.prefHeader}>
              <Text style={styles.prefTitle}>岗位详情</Text>
              <EditIcon />
            </View>
            <View style={styles.prefDivider} />
            {[
              ['岗位名称', jobDetails.position],
              ['薪资范围', jobDetails.salary],
              ['工作地点', jobDetails.location],
              ['经验要求', jobDetails.experience],
              ['学历要求', jobDetails.education],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
            <Text style={styles.infoDesc}>{jobDetails.description}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF7F0', position: 'relative' },
  gradStrip: { position: 'absolute', left: '33.33%', top: 0, width: '33.33%', height: 345, zIndex: 0 },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 9 },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '600', color: '#171718' },

  topSection: { paddingHorizontal: 16, paddingTop: 12, zIndex: 1 },

  aiStatus: { fontSize: 13, color: '#A48341', letterSpacing: 0.5, fontStyle: 'italic', marginBottom: 20 },

  pendSection: { position: 'relative', height: 89, justifyContent: 'center', marginHorizontal: -16 },
  waveWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  pendRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, zIndex: 1 },
  pendLabel: { fontSize: 28, fontWeight: '500', color: '#000', letterSpacing: 0.5, lineHeight: 35 },
  pendCount: { fontSize: 28, fontWeight: '500', color: '#A48341', letterSpacing: 0.5, lineHeight: 35 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 34, marginBottom: 28, marginTop: 8 },
  statCol: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '600', color: '#656D76', textAlign: 'center', letterSpacing: 0.5 },
  statLabel: { fontSize: 12, color: '#9EA7B3', letterSpacing: 0.5 },

  bottomCard: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },

  prefCard: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)', padding: 16,
    shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
    marginBottom: 12,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  infoLabel: { fontSize: 13, color: '#7B838D' },
  infoValue: { fontSize: 13, fontWeight: '500', color: '#000' },
  infoDesc: { fontSize: 13, color: '#7B838D', lineHeight: 20, marginTop: 8 },
  prefHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  prefTitle: { fontSize: 14, fontWeight: '500', color: '#000' },
  prefDivider: { height: 0.5, backgroundColor: '#F1F2F4', marginBottom: 9 },
  prefList: { gap: 8 },
  prefText: { fontSize: 13, color: '#7B838D', lineHeight: 21 },
  prefTag: { fontSize: 13, fontWeight: '600', color: '#008B68' },
});
