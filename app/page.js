"use client";
import { useState, useRef } from "react";

const PROFS = [
  { id:"nurse", label:"看護師",     icon:"🩺", desc:"症例報告・看護研究・実践報告" },
  { id:"pt",    label:"理学療法士", icon:"🦵", desc:"運動器・神経疾患・循環器リハ" },
  { id:"ot",    label:"作業療法士", icon:"🖐️", desc:"ADL・高次脳機能・精神科作業療法" },
  { id:"st",    label:"言語聴覚士", icon:"🗣️", desc:"嚥下・失語・高次脳機能障害" },
];

const CATEGORIES = {
  nurse:["症例報告","看護研究","実践報告","チーム医療報告","その他"],
  pt:   ["症例報告","臨床研究","実践報告","チーム医療報告","その他"],
  ot:   ["症例報告","臨床研究","実践報告","チーム医療報告","その他"],
  st:   ["症例報告","臨床研究","実践報告","チーム医療報告","その他"],
};

const FIELDS = {
  nurse:["急性期・ICU","救急","循環器","呼吸器","消化器","脳外科・神経内科","整形外科","精神科","外来・地域","その他"],
  pt:   ["急性期","回復期","維持期・生活期","地域","運動器","神経疾患","循環器・呼吸器","高齢者","その他"],
  ot:   ["急性期","回復期","維持期・生活期","運動器","神経疾患","高次脳機能障害","内部障害","精神科","その他"],
  st:   ["急性期","回復期","維持期・生活期","嚥下障害","失語症","高次脳機能障害","聴覚障害","小児","その他"],
};

const WORD_LIMITS = ["400字以内","500字以内","600字以内","800字以内","1000字以内","指定なし"];
const GENDERS     = ["男性","女性","記載なし"];
const AGE_GROUPS  = ["10歳代","20歳代","30歳代","40歳代","50歳代","60歳代","70歳代","80歳代","90歳代以上","記載なし"];
const PROF_LABEL  = { nurse:"看護師", pt:"理学療法士", ot:"作業療法士", st:"言語聴覚士" };

const SAMPLES = {
  nurse: {
    disease:"急性心不全", category:"症例報告", field:"循環器",
    gender:"男性", age:"90歳代以上", wordLimit:"800字以内",
    titleImg:"家族指導を中心とした退院支援による再入院予防",
    background:"同疾患の再入院が3ヶ月で5件続いた。従来の口頭説明だけでは理解が定着しないと感じていた。特に超高齢者では本人への指導に限界があり、家族を巻き込んだアプローチが必要と考えた。",
    intervention:"退院3日前より本人・妻にパンフレットを使用し、体重測定・塩分制限を計8回指導。毎回理解度を確認し、体重管理チェックシートを作成・配布した。",
    result:"退院後3ヶ月間再入院なし。外来受診時に体重記録表を持参し、2kg以内の変動幅で自己管理できていた。",
    numbers:"入院期間14日、指導8回実施、退院後3ヶ月観察",
    uniqueness:"家族（妻）を全指導に同席させ、実技指導を繰り返したことで介護力が向上した。",
    difference:"患者本人だけでなく妻が積極的に質問するようになった。",
  },
  pt: {
    disease:"脳梗塞（左片麻痺）", category:"症例報告", field:"神経疾患",
    gender:"男性", age:"70歳代", wordLimit:"600字以内",
    titleImg:"感覚フィードバック訓練による歩行能力改善",
    background:"入院60日経過しても歩行能力が改善せず、評価を再検討した結果、筋力よりも感覚障害が主因と判明した。",
    intervention:"感覚フィードバック訓練を週5回×8週間実施。BBS・10m歩行・TUGで介入前後を比較評価した。",
    result:"BBS 32→48点、10m歩行 18→11秒に改善。病棟内歩行が自立し退院となった。",
    numbers:"入院60日、訓練週5回×8週、BBS/TUG/10m歩行で評価",
    uniqueness:"筋力訓練ではなく感覚フィードバックに着目した点が従来と異なる。",
    difference:"患者が自主訓練を積極的に行うようになった。",
  },
  ot: {
    disease:"脳出血（右片麻痺・高次脳機能障害）", category:"症例報告", field:"高次脳機能障害",
    gender:"女性", age:"60歳代", wordLimit:"600字以内",
    titleImg:"作業の意味づけを活用した食事動作自立への介入",
    background:"反復練習では食事動作が自立せず、入院6週時点でFIM食事項目3点と改善が乏しかった。",
    intervention:"患者の好きな活動（料理）を訓練に取り入れ、週5回実施。FIM・MAMSで経過評価した。",
    result:"FIM食事項目 3→6点に改善。スプーン操作が自立し退院時FIM合計82点となった。",
    numbers:"入院45日、訓練週5回×6週、FIM/MAMSで評価",
    uniqueness:"作業の意味づけを重視し、患者が好きな活動を訓練に取り入れた。",
    difference:"患者の表情が明るくなり「やる気が出た」と話してくれた。",
  },
  st: {
    disease:"脳梗塞後遺症（嚥下障害・FILS Lv.3）", category:"症例報告", field:"嚥下障害",
    gender:"女性", age:"80歳代", wordLimit:"600字以内",
    titleImg:"段階的食形態移行による経口摂取再開への取り組み",
    background:"入院時より誤嚥性肺炎を反復し、VF検査で咽頭残留を認めた。経口摂取再開に向けた訓練選択が課題となった。",
    intervention:"姿勢調整と食形態の段階的変更を組み合わせ、間接・直接訓練を週5回実施。FILS・EATINGで経過評価した。",
    result:"FILS Lv.3→6に改善。全粥食へ移行し誤嚥性肺炎の再発なく退院となった。",
    numbers:"入院30日、訓練週5回×4週、VF2回実施",
    uniqueness:"姿勢調整と食形態の段階的変更を組み合わせた点が他と異なる。",
    difference:"患者が「食べることが楽しみになった」と話してくれた。",
  },
};

const LOADING_MSGS = [
  "抄録の構成を分析しています...",
  "医療用語を最適化しています...",
  "考察の論理構造を整えています...",
  "字数制限に合わせて調整しています...",
];

const buildPrompt = (f) => `あなたは${PROF_LABEL[f.prof]}の学会発表・抄録作成を専門とするアドバイザーです。
以下の情報をもとに、学会抄録を作成してください。

■ 発表者情報
職種：${PROF_LABEL[f.prof]}
カテゴリ：${f.category}
診療科・領域：${f.field}
患者情報：${[f.disease, f.gender!=="記載なし"?f.gender:null, f.age!=="記載なし"?f.age:null].filter(Boolean).join("・")}
タイトルイメージ：${f.titleImg}
字数制限：${f.wordLimit}

■ 発表内容
【背景・動機】${f.background}
【介入・取り組み内容】${f.intervention}
【結果・成果】${f.result}
【数値・期間の補足】${f.numbers||"記載なし"}
【なぜうまくいったか】${f.uniqueness||"記載なし"}
【他と違うと感じた点】${f.difference||"記載なし"}

■ 出力形式（この順番で厳守）

【タイトル案（3案）】
1.
2.
3.

【抄録本文】

制約：
- 字数制限「${f.wordLimit}」に厳密に収めること（本文末尾に実際の字数を（〇〇字）と記載すること）
- 構成：はじめに → 事例紹介 → 介入内容 → 結果 → 考察
- 入力にない具体的数値は【　】で空白にすること
- 患者個人が特定されない表現を使うこと
- 考察では「なぜうまくいったか」の解釈を中心に据えること
- 「この事例ならでは」の視点を1文以上盛り込むこと
- タイトル案は新規性・独自性が伝わる表現にすること
- 領域に応じた評価指標・専門用語を適切に使用すること`;

const checkIssues = (f) => {
  const issues = [];
  if (!f.prof)                        issues.push({ field:"prof",         msg:"職種を選択してください" });
  if (!f.category)                    issues.push({ field:"category",     msg:"発表カテゴリを選択してください" });
  if (!f.field)                       issues.push({ field:"field",        msg:"診療科・領域を選択してください" });
  if (!f.disease?.trim())             issues.push({ field:"disease",      msg:"疾患名を入力してください" });
  if (!f.titleImg?.trim())            issues.push({ field:"titleImg",     msg:"タイトルのイメージを入力してください" });
  if ((f.background||"").length < 20) issues.push({ field:"background",   msg:"背景・動機がやや短いです。もう少し具体的に" });
  if ((f.intervention||"").length<20) issues.push({ field:"intervention", msg:"介入内容がやや短いです。何を・何回・どのように" });
  if (!/[0-9０-９]/.test(f.result||""))issues.push({ field:"result",     msg:"結果に数値を入れると抄録の質が大幅に向上します" });
  if (!f.wordLimit)                   issues.push({ field:"wordLimit",    msg:"字数制限を選択してください" });
  return issues;
};

// ── カラートークン（ミントグリーン統一）──
const C = {
  mint:      "#10b981",
  mintDark:  "#059669",
  mintDeep:  "#065f46",
  mintLight: "#d1fae5",
  mintPale:  "#f0fdf4",
  mintBorder:"#a7f3d0",
  navy:      "#0f2744",
  navyLight: "#1a3a5c",
  white:     "#ffffff",
  gray50:    "#f8fafc",
  gray100:   "#f1f5f9",
  gray200:   "#e2e8f0",
  gray400:   "#94a3b8",
  gray600:   "#475569",
  gray700:   "#334155",
  gray900:   "#0f172a",
  red:       "#dc2626",
  redLight:  "#fee2e2",
  redBorder: "#fca5a5",
  amber:     "#d97706",
  amberLight:"#fef3c7",
  amberBorder:"#fde68a",
};

const s = {
  root:      { minHeight:"100vh", background:C.gray50, fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", color:C.gray900 },
  wrap:      { maxWidth:780, margin:"0 auto", paddingBottom:80 },

  // トップバー
  topBar:    { background:C.navy, padding:"13px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 8px rgba(0,0,0,0.18)" },
  topLeft:   { display:"flex", alignItems:"center", gap:10 },
  topDot:    { width:10, height:10, borderRadius:"50%", background:C.mint, boxShadow:`0 0 8px ${C.mint}` },
  topLogo:   { color:C.white, fontWeight:900, fontSize:17, letterSpacing:"0.06em" },
  topBadge:  { background:"rgba(16,185,129,0.18)", color:C.mintLight, fontSize:11, fontWeight:700, padding:"4px 14px", borderRadius:20, letterSpacing:"0.08em", border:`1px solid rgba(16,185,129,0.3)` },

  // 注意バナー
  noticeBanner:{ background:C.amberLight, borderBottom:`1px solid ${C.amberBorder}`, padding:"9px 28px", display:"flex", alignItems:"center", gap:8 },
  noticeText:  { fontSize:12, color:C.amber, fontWeight:600 },

  // ヒーロー
  hero:      { background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 60%, #0d4f3c 100%)`, padding:"44px 28px 40px", position:"relative", overflow:"hidden" },
  heroBg:    { position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(16,185,129,0.07)", pointerEvents:"none" },
  heroBg2:   { position:"absolute", bottom:-40, left:-40, width:200, height:200, borderRadius:"50%", background:"rgba(16,185,129,0.05)", pointerEvents:"none" },
  heroTag:   { display:"inline-flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.2)", border:`1px solid rgba(16,185,129,0.4)`, color:C.mintLight, fontSize:11, fontWeight:700, padding:"5px 14px", borderRadius:20, marginBottom:16, letterSpacing:"0.1em" },
  heroH1:    { fontSize:30, fontWeight:900, color:C.white, margin:"0 0 12px", lineHeight:1.3, letterSpacing:"-0.01em" },
  heroH1Accent:{ color:C.mint },
  heroSub:   { fontSize:14, color:"rgba(255,255,255,0.7)", margin:"0 0 28px", lineHeight:1.8 },
  heroFeats: { display:"flex", gap:0, flexWrap:"wrap", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, overflow:"hidden" },
  heroFeat:  { flex:"1 1 40%", display:"flex", alignItems:"center", gap:8, fontSize:13, color:"rgba(255,255,255,0.85)", padding:"12px 16px", borderRight:"1px solid rgba(255,255,255,0.08)", fontWeight:500 },
  heroFeatIcon:{ fontSize:16 },

  // ステップ
  stepsWrap: { background:C.white, borderBottom:`1px solid ${C.gray200}`, padding:"0 28px", display:"flex", alignItems:"stretch", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 6px rgba(0,0,0,0.06)" },
  stepItem:  { display:"flex", alignItems:"center", gap:8, padding:"14px 0", flex:1 },
  stepCircle:{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, flexShrink:0, transition:"all 0.2s" },
  stepActive:{ background:C.mint, color:C.white, boxShadow:`0 2px 8px rgba(16,185,129,0.4)` },
  stepDone:  { background:C.mintDeep, color:C.white },
  stepOff:   { background:C.gray200, color:C.gray400 },
  stepLabel: { fontSize:12, color:C.gray400, fontWeight:600 },
  stepLabelA:{ color:C.mintDark, fontWeight:800 },
  stepLine:  { flex:1, height:2, background:C.gray200, margin:"0 12px", borderRadius:2 },
  stepLineDone:{ background:C.mint },

  // カード
  card:      { background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:"28px 28px", margin:"20px 20px 0", boxShadow:"0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize:18, fontWeight:900, color:C.gray900, margin:"0 0 6px", display:"flex", alignItems:"center", gap:10, letterSpacing:"-0.01em" },
  cardTitleBar:{ width:4, height:20, background:C.mint, borderRadius:2, flexShrink:0 },
  cardSub:   { fontSize:13, color:C.gray600, margin:"0 0 24px", lineHeight:1.8, paddingLeft:14 },

  // セクション
  sec:       { marginBottom:24 },
  lbl:       { display:"block", fontSize:13, fontWeight:800, color:C.gray700, marginBottom:8, letterSpacing:"0.01em" },
  req:       { color:C.red, fontSize:11, marginLeft:4, fontWeight:700 },
  opt:       { color:C.gray400, fontSize:11, marginLeft:4, fontWeight:500 },
  hint:      { fontSize:12, color:C.gray600, margin:"-4px 0 10px", lineHeight:1.75, paddingLeft:10, borderLeft:`3px solid ${C.mint}` },

  // 職種カード
  profGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  profCard:  { display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.gray50, border:`2px solid ${C.gray200}`, borderRadius:12, cursor:"pointer", transition:"all 0.15s", textAlign:"left", width:"100%" },
  profCardOn:{ background:C.mintPale, borderColor:C.mint, boxShadow:`0 0 0 3px rgba(16,185,129,0.1)` },
  profIcon:  { fontSize:26, flexShrink:0 },
  profLbl:   { fontSize:14, fontWeight:800, color:C.gray900, marginBottom:2 },
  profDesc:  { fontSize:11, color:C.gray400, fontWeight:500 },

  // チップ
  chips:     { display:"flex", flexWrap:"wrap", gap:7 },
  chip:      { padding:"7px 14px", borderRadius:8, border:`1px solid ${C.gray200}`, background:C.gray50, color:C.gray600, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600, transition:"all 0.15s" },
  chipOn:    { background:C.mintPale, borderColor:C.mint, color:C.mintDeep, fontWeight:800, boxShadow:`0 0 0 2px rgba(16,185,129,0.15)` },

  // 入力
  inp:       { width:"100%", background:C.white, border:`1.5px solid ${C.gray200}`, borderRadius:9, color:C.gray900, fontSize:14, padding:"11px 14px", outline:"none", fontFamily:"inherit", boxSizing:"border-box", fontWeight:500, transition:"border-color 0.15s, box-shadow 0.15s" },
  ta:        { width:"100%", background:C.white, border:`1.5px solid ${C.gray200}`, borderRadius:9, color:C.gray900, fontSize:14, padding:"11px 14px", resize:"vertical", outline:"none", fontFamily:"inherit", lineHeight:1.8, boxSizing:"border-box", fontWeight:500, transition:"border-color 0.15s, box-shadow 0.15s" },
  fieldBox:  { marginBottom:18, padding:"18px", background:C.gray50, borderRadius:12, border:`1px solid ${C.gray200}` },
  fieldErr:  { borderColor:C.redBorder, background:C.redLight },

  // サンプルバナー
  sampleBanner:{ background:C.mintPale, border:`1px solid ${C.mintBorder}`, borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" },
  sampleInfo:  { flex:1 },
  sampleTitle: { fontSize:13, fontWeight:800, color:C.mintDeep, marginBottom:3 },
  sampleText:  { fontSize:12, color:C.mintDark, lineHeight:1.6 },
  btnSample:   { padding:"9px 18px", background:C.mint, color:C.white, fontWeight:800, fontSize:12, border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", boxShadow:`0 2px 8px rgba(16,185,129,0.3)`, transition:"all 0.15s" },

  // ボタン
  btnPrimary:{ display:"block", width:"100%", marginTop:26, padding:"15px", background:C.mint, color:C.white, fontWeight:900, fontSize:15, border:"none", borderRadius:11, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.03em", boxShadow:`0 4px 16px rgba(16,185,129,0.35)`, transition:"all 0.15s" },
  btnOff:    { background:C.gray400, cursor:"not-allowed", boxShadow:"none" },
  navRow:    { display:"flex", gap:12, marginTop:24 },
  btnBack:   { flex:"0 0 110px", padding:"14px", background:C.gray100, color:C.gray600, fontWeight:700, fontSize:14, border:`1px solid ${C.gray200}`, borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" },

  // バナー
  issueBanner:{ background:C.amberLight, border:`1px solid ${C.amberBorder}`, borderRadius:12, padding:"14px 18px", marginBottom:20 },
  issueTitle: { color:C.amber, fontWeight:800, fontSize:14, margin:"0 0 4px" },
  issueSub:   { color:"#92400e", fontSize:12, margin:"0 0 8px" },
  issueItem:  { color:C.amber, fontSize:12, margin:"4px 0", fontWeight:600 },
  okBanner:   { background:C.mintPale, border:`1px solid ${C.mintBorder}`, borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 },
  okText:     { color:C.mintDeep, fontWeight:800, fontSize:13 },
  errMsg:     { color:C.red, fontSize:13, margin:"0 0 12px", padding:"12px 16px", background:C.redLight, borderRadius:9, border:`1px solid ${C.redBorder}`, fontWeight:600 },

  // ローディング
  loadWrap:  { textAlign:"center", padding:"60px 20px" },
  ringWrap:  { position:"relative", width:64, height:64, margin:"0 auto 28px" },
  ring:      { width:64, height:64, border:`3px solid ${C.mintLight}`, borderTop:`3px solid ${C.mint}`, borderRadius:"50%", animation:"spin 0.85s linear infinite" },
  ringDot:   { position:"absolute", top:3, left:"50%", transform:"translateX(-50%)", width:8, height:8, borderRadius:"50%", background:C.mint },
  loadTitle: { fontSize:18, fontWeight:900, color:C.gray900, marginBottom:8, letterSpacing:"-0.01em" },
  loadMsg:   { fontSize:13, color:C.mintDark, marginBottom:4, fontWeight:600 },
  loadSub:   { fontSize:12, color:C.gray400 },

  // 完了
  resultHeader:{ background:C.mintPale, border:`1px solid ${C.mintBorder}`, borderRadius:12, padding:"18px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 },
  resultTitle: { fontSize:18, fontWeight:900, color:C.mintDeep, marginBottom:4, letterSpacing:"-0.01em" },
  resultSub:   { fontSize:12, color:C.mintDark, fontWeight:600 },
  actBtns:     { display:"flex", gap:8, flexWrap:"wrap" },
  btnRegen:    { padding:"9px 18px", background:C.white, color:C.mintDark, fontWeight:800, fontSize:13, border:`1.5px solid ${C.mint}`, borderRadius:9, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" },
  btnReset:    { padding:"9px 16px", background:C.white, color:C.gray600, fontWeight:700, fontSize:13, border:`1px solid ${C.gray200}`, borderRadius:9, cursor:"pointer", fontFamily:"inherit" },

  charBar:     { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  charLabel:   { fontSize:12, color:C.gray600, fontWeight:700 },
  charCount:   { fontSize:13, fontWeight:800, padding:"4px 14px", borderRadius:20 },
  charOk:      { background:C.mintPale, color:C.mintDeep, border:`1px solid ${C.mintBorder}` },
  charWarn:    { background:C.amberLight, color:C.amber, border:`1px solid ${C.amberBorder}` },

  outputTa:    { width:"100%", background:C.gray50, border:`1.5px solid ${C.gray200}`, borderRadius:12, padding:"18px", color:C.gray900, fontSize:14, lineHeight:2, fontFamily:"'Noto Sans JP',sans-serif", boxSizing:"border-box", resize:"vertical", outline:"none", marginBottom:14, fontWeight:500 },
  copyAllBtn:  { width:"100%", padding:"14px", background:C.mint, color:C.white, fontWeight:900, fontSize:14, border:"none", borderRadius:11, cursor:"pointer", fontFamily:"inherit", marginBottom:16, boxShadow:`0 4px 16px rgba(16,185,129,0.35)`, letterSpacing:"0.03em", transition:"all 0.15s" },

  adviceCard:  { background:C.mintPale, border:`1px solid ${C.mintBorder}`, borderRadius:12, padding:"16px 18px", marginBottom:16 },
  adviceTitle: { fontSize:13, fontWeight:800, color:C.mintDeep, marginBottom:8, display:"flex", alignItems:"center", gap:6 },
  adviceText:  { fontSize:13, color:"#065f46cc", lineHeight:1.8 },

  disclaimer:  { background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:12, padding:"14px 18px", marginTop:8 },
  disclaimerT: { fontSize:12, fontWeight:800, color:C.gray600, marginBottom:6 },
  disclaimerL: { fontSize:11, color:C.gray400, lineHeight:1.9 },

  summary:     { display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 },
  tag:         { background:C.mintPale, border:`1px solid ${C.mintBorder}`, color:C.mintDeep, fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20 },

  row2:        { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  footer:      { textAlign:"center", marginTop:48, padding:"20px", color:C.gray400, fontSize:11, lineHeight:1.9, borderTop:`1px solid ${C.gray200}` },
};

export default function App() {
  const [page, setPage]           = useState(1);
  const [form, setForm]           = useState({ gender:"記載なし", age:"記載なし" });
  const [issues, setIssues]       = useState([]);
  const [output, setOutput]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [loadMsg, setLoadMsg]     = useState(0);
  const [error, setError]         = useState("");
  const [charCount, setCharCount] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);
  const timerRef = useRef(null);

  const p   = form.prof;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const loadSample = () => {
    if (!p) return;
    setForm(f => ({ ...f, ...SAMPLES[p] }));
  };

  const goConfirm = () => {
    setIssues(checkIssues(form));
    setPage(2);
    window.scrollTo(0, 0);
  };

  const startLoadingMsgs = () => {
    let i = 0;
    timerRef.current = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadMsg(i);
    }, 2200);
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setLoadMsg(0);
    startLoadingMsgs();
    try {
      const res  = await fetch("/api/generate", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ prompt: buildPrompt(form) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      setOutput(data.text);
      const body = data.text.match(/【抄録本文】([\s\S]*)/);
      setCharCount(body ? body[1].trim().length : data.text.length);
      setPage(3);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      clearInterval(timerRef.current);
    }
  };

  const copyAll = () => {
    try { navigator.clipboard.writeText(output); } catch {}
    const ta = document.createElement("textarea");
    ta.value = output; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy");
    document.body.removeChild(ta);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const reset = () => {
    setForm({ gender:"記載なし", age:"記載なし" });
    setPage(1); setOutput(""); setIssues([]); setError(""); setCharCount(0);
    window.scrollTo(0, 0);
  };

  const errFields = issues.map(i => i.field);
  const fb = (field) => ({ ...s.fieldBox, ...(errFields.includes(field) && page===2 ? s.fieldErr : {}) });

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{ ...s.chip, ...(active ? s.chipOn : {}) }}>{label}</button>
  );

  const Steps = () => (
    <div style={s.stepsWrap}>
      {["入力","確認・修正","生成完了"].map((label, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", flex: i<2 ? 1 : "auto" }}>
          <div style={s.stepItem}>
            <div style={{ ...s.stepCircle, ...(page===i+1?s.stepActive:page>i+1?s.stepDone:s.stepOff) }}>
              {page > i+1 ? "✓" : i+1}
            </div>
            <span style={{ ...s.stepLabel, ...(page===i+1?s.stepLabelA:{}) }}>{label}</span>
          </div>
          {i < 2 && <div style={{ ...s.stepLine, ...(page>i+1?s.stepLineDone:{}) }} />}
        </div>
      ))}
    </div>
  );

  const CharBadge = () => {
    const m = (form.wordLimit||"").match(/(\d+)/);
    const limit = m ? parseInt(m[1]) : 0;
    if (!limit || !charCount) return null;
    const over = charCount > limit;
    return (
      <span style={{ ...s.charCount, ...(over ? s.charWarn : s.charOk) }}>
        {charCount} / {limit} 字　{over ? "⚠️ オーバー" : "✅ OK"}
      </span>
    );
  };

  const InputForm = ({ isConfirm }) => (
    <>
      {/* サンプルバナー */}
      {p && !isConfirm && (
        <div style={s.sampleBanner}>
          <span style={{ fontSize:22 }}>💡</span>
          <div style={s.sampleInfo}>
            <div style={s.sampleTitle}>入力例を参考にしますか？</div>
            <div style={s.sampleText}>{PROF_LABEL[p]}向けのサンプルデータを一括入力できます。何を書けばいいか迷ったときにどうぞ。</div>
          </div>
          <button style={s.btnSample} onClick={loadSample}>サンプルを読み込む</button>
        </div>
      )}

      {/* 職種 */}
      <div style={fb("prof")}>
        <label style={s.lbl}>職種 <span style={s.req}>必須</span></label>
        <div style={s.profGrid}>
          {PROFS.map(pr => (
            <button key={pr.id} onClick={() => set("prof", pr.id)}
              style={{ ...s.profCard, ...(form.prof===pr.id ? s.profCardOn : {}) }}>
              <span style={s.profIcon}>{pr.icon}</span>
              <div>
                <div style={s.profLbl}>{pr.label}</div>
                <div style={s.profDesc}>{pr.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {p && <>
        <div style={fb("category")}>
          <label style={s.lbl}>発表カテゴリ <span style={s.req}>必須</span></label>
          <div style={s.chips}>
            {CATEGORIES[p].map(o => <Chip key={o} label={o} active={form.category===o} onClick={() => set("category",o)} />)}
          </div>
        </div>

        <div style={fb("field")}>
          <label style={s.lbl}>診療科・領域 <span style={s.req}>必須</span></label>
          <div style={s.chips}>
            {FIELDS[p].map(o => <Chip key={o} label={o} active={form.field===o} onClick={() => set("field",o)} />)}
          </div>
        </div>

        <div style={fb("disease")}>
          <label style={s.lbl}>疾患・障害名 <span style={s.req}>必須</span></label>
          <input style={s.inp} value={form.disease||""} onChange={e=>set("disease",e.target.value)}
            placeholder="例：急性心不全、脳梗塞（左片麻痺）"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={s.row2}>
          <div style={fb("gender")}>
            <label style={s.lbl}>性別 <span style={s.opt}>任意</span></label>
            <div style={s.chips}>{GENDERS.map(o => <Chip key={o} label={o} active={form.gender===o} onClick={() => set("gender",o)} />)}</div>
          </div>
          <div style={fb("age")}>
            <label style={s.lbl}>年齢層 <span style={s.opt}>任意</span></label>
            <div style={s.chips}>{AGE_GROUPS.map(o => <Chip key={o} label={o} active={form.age===o} onClick={() => set("age",o)} />)}</div>
          </div>
        </div>

        <div style={fb("titleImg")}>
          <label style={s.lbl}>タイトルのイメージ <span style={s.req}>必須</span></label>
          <p style={s.hint}>キーワードでOKです。AIが3案に展開します</p>
          <input style={s.inp} value={form.titleImg||""} onChange={e=>set("titleImg",e.target.value)}
            placeholder="例：家族指導による再入院予防、感覚フィードバック訓練"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={fb("background")}>
          <label style={s.lbl}>背景・動機・気づき <span style={s.req}>必須</span></label>
          <p style={s.hint}>「なぜこの症例を発表しようと思ったか」「臨床上どんな問題・疑問があったか」を書いてください</p>
          <textarea style={s.ta} rows={4} value={form.background||""} onChange={e=>set("background",e.target.value)}
            placeholder="例：同疾患の再入院が続いた。従来の指導方法では理解が定着しないと感じた。"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={fb("intervention")}>
          <label style={s.lbl}>介入・取り組みの内容 <span style={s.req}>必須</span></label>
          <p style={s.hint}>何を・誰に・何回・どのように行ったか。回数・期間・評価指標があると質が上がります</p>
          <textarea style={s.ta} rows={4} value={form.intervention||""} onChange={e=>set("intervention",e.target.value)}
            placeholder="例：週5回×8週間、〇〇訓練を実施。BBS・TUGで介入前後を比較評価した。"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={fb("result")}>
          <label style={s.lbl}>結果・成果 <span style={s.req}>必須</span></label>
          <p style={s.hint}>数値（評価点数・期間・改善率）があると説得力が大幅に上がります</p>
          <textarea style={s.ta} rows={4} value={form.result||""} onChange={e=>set("result",e.target.value)}
            placeholder="例：BBS 32→48点に改善。病棟内歩行が自立し退院となった。"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={s.fieldBox}>
          <label style={s.lbl}>数値・期間の補足 <span style={s.opt}>任意</span></label>
          <textarea style={s.ta} rows={2} value={form.numbers||""} onChange={e=>set("numbers",e.target.value)}
            placeholder="例：入院期間14日、指導8回実施、退院後3ヶ月観察"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={s.fieldBox}>
          <label style={s.lbl}>なぜうまくいったと思いますか？ <span style={s.opt}>任意・考察の核になります</span></label>
          <textarea style={s.ta} rows={3} value={form.uniqueness||""} onChange={e=>set("uniqueness",e.target.value)}
            placeholder="例：家族を全指導に同席させ実技指導を繰り返したことで介護力が向上した。"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={s.fieldBox}>
          <label style={s.lbl}>他と違うと感じた点 <span style={s.opt}>任意・新規性の根拠になります</span></label>
          <textarea style={s.ta} rows={3} value={form.difference||""} onChange={e=>set("difference",e.target.value)}
            placeholder="例：患者本人だけでなく妻が積極的に質問するようになった。"
            onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
            onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}} />
        </div>

        <div style={fb("wordLimit")}>
          <label style={s.lbl}>抄録の字数制限 <span style={s.req}>必須</span></label>
          <div style={s.chips}>
            {WORD_LIMITS.map(o => <Chip key={o} label={o} active={form.wordLimit===o} onClick={() => set("wordLimit",o)} />)}
          </div>
        </div>
      </>}

      {!p && !isConfirm && (
        <p style={{ color:C.gray400, fontSize:14, textAlign:"center", marginTop:16, padding:"20px 0", fontWeight:600 }}>
          ↑ まず職種を選択してください
        </p>
      )}
    </>
  );

  return (
    <div style={s.root}>
      {/* トップバー */}
      <div style={s.topBar}>
        <div style={s.topLeft}>
          <div style={s.topDot} />
          <span style={s.topLogo}>MediWork AI</span>
        </div>
        <span style={s.topBadge}>医療職専用 学会抄録作成ツール</span>
      </div>

      {/* 注意バナー */}
      <div style={s.noticeBanner}>
        <span>⚠️</span>
        <span style={s.noticeText}>
          本ツールはAIによる文章支援ツールです。生成内容は必ずご自身で確認・修正してください。個人が特定される情報は入力しないでください。診断・治療目的ではありません。
        </span>
      </div>

      <div style={s.wrap}>
        {/* ヒーロー（PAGE1のみ） */}
        {page === 1 && (
          <div style={s.hero}>
            <div style={s.heroBg} />
            <div style={s.heroBg2} />
            <div style={s.heroTag}>
              <span style={{ color:C.mint }}>●</span> 学会発表 AI支援ツール
            </div>
            <h1 style={s.heroH1}>
              学会抄録を、<br />
              <span style={s.heroH1Accent}>3ステップ</span>で完成させる
            </h1>
            <p style={s.heroSub}>
              看護師・PT・OT・STの学会発表に特化した抄録生成ツールです。<br />
              臨床情報を入力するだけで、審査員に伝わる抄録を自動生成します。
            </p>
            <div style={s.heroFeats}>
              {[
                ["✅","職種別テンプレート対応"],
                ["✅","字数制限を自動調整"],
                ["✅","タイトル案3つ同時生成"],
                ["✅","考察・構成を自動整理"],
              ].map(([icon, text], i) => (
                <span key={i} style={{ ...s.heroFeat, ...(i%2===1?{ borderRight:"none" }:{}) }}>
                  <span style={s.heroFeatIcon}>{icon}</span>{text}
                </span>
              ))}
            </div>
          </div>
        )}

        <Steps />

        {/* PAGE 1 */}
        {page === 1 && (
          <div style={s.card}>
            <div style={s.cardTitle}>
              <div style={s.cardTitleBar} />
              発表情報を入力してください
            </div>
            <div style={s.cardSub}>
              必須項目を入力して「確認する」を押してください。任意項目を充実させると抄録の質が上がります。
            </div>
            <InputForm isConfirm={false} />
            {p && (
              <button onClick={goConfirm} style={s.btnPrimary}
                onMouseOver={e=>e.target.style.background=C.mintDark}
                onMouseOut={e=>e.target.style.background=C.mint}>
                内容を確認する →
              </button>
            )}
          </div>
        )}

        {/* PAGE 2 */}
        {page === 2 && (
          <div style={s.card}>
            <div style={s.cardTitle}>
              <div style={s.cardTitleBar} />
              内容を確認・修正してください
            </div>

            {issues.length > 0 ? (
              <div style={s.issueBanner}>
                <p style={s.issueTitle}>⚠️ {issues.length}件の改善点があります</p>
                <p style={s.issueSub}>赤枠の項目を修正してから生成してください（スキップも可能です）</p>
                {issues.map((issue,i) => <p key={i} style={s.issueItem}>• {issue.msg}</p>)}
              </div>
            ) : (
              <div style={s.okBanner}>
                <span style={{ fontSize:20 }}>✅</span>
                <p style={s.okText}>情報は十分です！このまま生成できます。</p>
              </div>
            )}

            <InputForm isConfirm={true} />

            {error && <div style={s.errMsg}>❌ {error}</div>}

            <div style={s.navRow}>
              <button onClick={() => { setPage(1); window.scrollTo(0,0); }} style={s.btnBack}>← 戻る</button>
              <button onClick={generate} disabled={loading}
                style={{ ...s.btnPrimary, ...(loading?s.btnOff:{}), marginTop:0, flex:1 }}>
                {loading ? "生成中..." : "抄録を生成する ✦"}
              </button>
            </div>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div style={{ ...s.card, marginTop:0 }}>
            <div style={s.loadWrap}>
              <div style={s.ringWrap}>
                <div style={s.ring} />
              </div>
              <div style={s.loadTitle}>ただいま作成中...</div>
              <div style={s.loadMsg}>{LOADING_MSGS[loadMsg]}</div>
              <div style={s.loadSub}>抄録・タイトル案を生成しています。少々お待ちください。</div>
            </div>
          </div>
        )}

        {/* PAGE 3 */}
        {page === 3 && output && (
          <div style={s.card}>
            <div style={s.resultHeader}>
              <div>
                <div style={s.resultTitle}>✅ 抄録が完成しました！</div>
                <div style={s.resultSub}>【　】に実際の数値を入れて完成させてください。内容は直接編集できます。</div>
              </div>
              <div style={s.actBtns}>
                <button onClick={generate} style={s.btnRegen}
                  onMouseOver={e=>e.target.style.background=C.mintPale}
                  onMouseOut={e=>e.target.style.background=C.white}>
                  🔄 再生成
                </button>
                <button onClick={reset} style={s.btnReset}>🆕 最初から</button>
              </div>
            </div>

            <div style={s.summary}>
              {[["職種",PROF_LABEL[form.prof]],["カテゴリ",form.category],["診療科",form.field],["疾患",form.disease],["字数",form.wordLimit]]
                .filter(([,v])=>v).map(([k,v])=><span key={k} style={s.tag}>{k}：{v}</span>)}
            </div>

            <div style={s.charBar}>
              <span style={s.charLabel}>抄録本文字数</span>
              <CharBadge />
            </div>

            <textarea style={s.outputTa} rows={24} value={output}
              onChange={e => {
                setOutput(e.target.value);
                const body = e.target.value.match(/【抄録本文】([\s\S]*)/);
                setCharCount(body ? body[1].trim().length : e.target.value.length);
              }}
              onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,0.12)`;}}
              onBlur={e=>{e.target.style.borderColor=C.gray200;e.target.style.boxShadow="none";}}
            />

            <button style={{ ...s.copyAllBtn, ...(copiedAll?{background:C.mintDeep}:{}) }}
              onClick={copyAll}
              onMouseOver={e=>{ if(!copiedAll) e.target.style.background=C.mintDark; }}
              onMouseOut={e=>{ if(!copiedAll) e.target.style.background=C.mint; }}>
              {copiedAll ? "✓ コピー完了！" : "📋 全文をコピーする"}
            </button>

            <div style={s.adviceCard}>
              <div style={s.adviceTitle}>💡 さらに精度を上げるには</div>
              <div style={s.adviceText}>
                この抄録をClaude.aiに貼り付けて依頼すると仕上がりが上がります：<br />
                「考察をもっと具体的に」「字数を〇〇字以内に収めて」「タイトルをより新規性のある表現に」
              </div>
            </div>

            <div style={s.disclaimer}>
              <div style={s.disclaimerT}>⚠️ ご利用にあたって</div>
              <div style={s.disclaimerL}>
                • 本ツールはAIによる文章支援ツールです。生成内容は必ずご自身で確認・修正してください。<br />
                • 【　】で示された箇所は入力情報に含まれていなかった数値です。実際の数値に置き換えてください。<br />
                • 患者個人が特定される情報は入力しないでください。<br />
                • 本ツールは診断・治療を目的としたものではありません。
              </div>
            </div>
          </div>
        )}

        <div style={s.footer}>
          MediWork AI ｜ 医療職向け学会抄録サポートツール<br />
          © 2025 MediWork AI ｜ 本ツールはAI文章支援ツールです。生成内容の最終確認は必ずご自身で行ってください。
        </div>
      </div>
    </div>
  );
}
