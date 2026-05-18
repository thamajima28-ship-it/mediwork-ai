"use client";
import { useState, useRef } from "react";

// ─── データ定義 ───────────────────────────────────────
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

const PROF_LABEL = { nurse:"看護師", pt:"理学療法士", ot:"作業療法士", st:"言語聴覚士" };

// サンプル入力
const SAMPLES = {
  nurse: {
    disease:"急性心不全",
    titleImg:"家族指導を中心とした退院支援による再入院予防",
    background:"同疾患の再入院が3ヶ月で5件続いた。従来の口頭説明だけでは理解が定着しないと感じていた。特に超高齢者では本人への指導に限界があり、家族を巻き込んだアプローチが必要と考えた。",
    intervention:"退院3日前より本人・妻にパンフレットを使用し、体重測定・塩分制限を計8回指導。毎回理解度を確認し、体重管理チェックシートを作成・配布した。",
    result:"退院後3ヶ月間再入院なし。外来受診時に体重記録表を持参し、2kg以内の変動幅で自己管理できていた。",
    numbers:"入院期間14日、指導8回実施、退院後3ヶ月観察",
    uniqueness:"家族（妻）を全指導に同席させ、実技指導を繰り返したことで介護力が向上した。",
    difference:"患者本人だけでなく妻が積極的に質問するようになった。",
    wordLimit:"800字以内", gender:"男性", age:"90歳代以上",
    category:"症例報告", field:"循環器",
  },
  pt: {
    disease:"脳梗塞（左片麻痺）",
    titleImg:"感覚フィードバック訓練による歩行能力改善",
    background:"入院60日経過しても歩行能力が改善せず、評価を再検討した結果、筋力よりも感覚障害が主因と判明した。",
    intervention:"感覚フィードバック訓練を週5回×8週間実施。BBS・10m歩行・TUGで介入前後を比較評価した。",
    result:"BBS 32→48点、10m歩行 18→11秒に改善。病棟内歩行が自立し退院となった。",
    numbers:"入院60日、訓練週5回×8週、BBS/TUG/10m歩行で評価",
    uniqueness:"筋力訓練ではなく感覚フィードバックに着目した点が従来と異なる。",
    difference:"患者が自主訓練を積極的に行うようになった。",
    wordLimit:"600字以内", gender:"男性", age:"70歳代",
    category:"症例報告", field:"神経疾患",
  },
  ot: {
    disease:"脳出血（右片麻痺・高次脳機能障害）",
    titleImg:"作業の意味づけを活用した食事動作自立への介入",
    background:"反復練習では食事動作が自立せず、入院6週時点でFIM食事項目3点と改善が乏しかった。",
    intervention:"患者の好きな活動（料理）を訓練に取り入れ、週5回実施。FIM・MAMSで経過評価した。",
    result:"FIM食事項目 3→6点に改善。スプーン操作が自立し退院時FIM合計82点となった。",
    numbers:"入院45日、訓練週5回×6週、FIM/MAMSで評価",
    uniqueness:"作業の意味づけを重視し、患者が好きな活動を訓練に取り入れた。",
    difference:"患者の表情が明るくなり「やる気が出た」と話してくれた。",
    wordLimit:"600字以内", gender:"女性", age:"60歳代",
    category:"症例報告", field:"高次脳機能障害",
  },
  st: {
    disease:"脳梗塞後遺症（嚥下障害・FILS Lv.3）",
    titleImg:"段階的食形態移行による経口摂取再開への取り組み",
    background:"入院時より誤嚥性肺炎を反復し、VF検査で咽頭残留を認めた。経口摂取再開に向けた訓練選択が課題となった。",
    intervention:"姿勢調整と食形態の段階的変更を組み合わせ、間接・直接訓練を週5回実施。FILS・EATINGで経過評価した。",
    result:"FILS Lv.3→6に改善。全粥食へ移行し誤嚥性肺炎の再発なく退院となった。",
    numbers:"入院30日、訓練週5回×4週、VF2回実施",
    uniqueness:"姿勢調整と食形態の段階的変更を組み合わせた点が他と異なる。",
    difference:"患者が「食べることが楽しみになった」と話してくれた。",
    wordLimit:"600字以内", gender:"女性", age:"80歳代",
    category:"症例報告", field:"嚥下障害",
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

// ─── スタイル定義 ───────────────────────────────────────
const s = {
  // レイアウト
  root:      { minHeight:"100vh", background:"#f8fafc", fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", color:"#1e293b" },
  wrap:      { maxWidth:760, margin:"0 auto", padding:"0 0 80px" },

  // トップバー
  topBar:    { background:"#1e3a5f", padding:"12px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  topLogo:   { color:"#fff", fontWeight:900, fontSize:16, letterSpacing:"0.05em" },
  topBadge:  { background:"rgba(255,255,255,0.15)", color:"#e2e8f0", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20, letterSpacing:"0.08em" },

  // 注意バナー
  noticeBanner: { background:"#fefce8", borderBottom:"1px solid #fde047", padding:"8px 28px", display:"flex", alignItems:"center", gap:8 },
  noticeText:   { fontSize:12, color:"#854d0e", fontWeight:500 },

  // ヒーローセクション
  hero:      { background:"linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 100%)", padding:"40px 28px 36px", color:"#fff" },
  heroTag:   { display:"inline-block", background:"rgba(255,255,255,0.15)", fontSize:11, fontWeight:700, padding:"4px 14px", borderRadius:20, marginBottom:14, letterSpacing:"0.1em" },
  heroH1:    { fontSize:28, fontWeight:900, margin:"0 0 10px", lineHeight:1.3 },
  heroSub:   { fontSize:14, color:"rgba(255,255,255,0.75)", margin:"0 0 24px", lineHeight:1.7 },
  heroFeats: { display:"flex", gap:20, flexWrap:"wrap" },
  heroFeat:  { display:"flex", alignItems:"center", gap:6, fontSize:13, color:"rgba(255,255,255,0.85)" },

  // サンプルバナー
  sampleBanner: { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"flex-start", gap:12 },
  sampleTitle:  { fontSize:13, fontWeight:700, color:"#1d4ed8", marginBottom:4 },
  sampleText:   { fontSize:12, color:"#3b82f6", lineHeight:1.6 },

  // ステップ
  stepsWrap:  { background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"16px 28px", display:"flex", alignItems:"center", gap:0, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  stepItem:   { display:"flex", alignItems:"center", gap:8 },
  stepCircle: { width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 },
  stepActive: { background:"#1d4ed8", color:"#fff" },
  stepDone:   { background:"#16a34a", color:"#fff" },
  stepOff:    { background:"#e2e8f0", color:"#94a3b8" },
  stepLabel:  { fontSize:12, color:"#64748b", fontWeight:500 },
  stepLabelActive: { color:"#1d4ed8", fontWeight:700 },
  stepLine:   { flex:1, height:2, background:"#e2e8f0", margin:"0 10px" },
  stepLineDone:{ background:"#16a34a" },

  // カード
  card:      { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"28px", margin:"20px 20px 0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize:17, fontWeight:800, color:"#1e293b", margin:"0 0 6px", display:"flex", alignItems:"center", gap:8 },
  cardSub:   { fontSize:13, color:"#64748b", margin:"0 0 24px", lineHeight:1.7 },

  // セクション
  sec:       { marginBottom:22 },
  lbl:       { display:"block", fontSize:13, fontWeight:700, color:"#334155", marginBottom:8 },
  req:       { color:"#dc2626", fontSize:11, marginLeft:4, fontWeight:700 },
  opt:       { color:"#94a3b8", fontSize:11, marginLeft:4 },
  hint:      { fontSize:12, color:"#64748b", margin:"-4px 0 8px", lineHeight:1.7, paddingLeft:10, borderLeft:"3px solid #3b82f6" },

  // 職種カード
  profGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  profCard:  { display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"#f8fafc", border:"2px solid #e2e8f0", borderRadius:10, cursor:"pointer", transition:"all 0.15s", textAlign:"left" },
  profCardOn:{ background:"#eff6ff", borderColor:"#3b82f6" },
  profIcon:  { fontSize:24, flexShrink:0 },
  profLbl:   { fontSize:14, fontWeight:700, color:"#1e293b", marginBottom:2 },
  profDesc:  { fontSize:11, color:"#64748b" },

  // チップ
  chips:     { display:"flex", flexWrap:"wrap", gap:7 },
  chip:      { padding:"6px 13px", borderRadius:7, border:"1px solid #e2e8f0", background:"#f8fafc", color:"#64748b", fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", fontWeight:500 },
  chipOn:    { background:"#eff6ff", borderColor:"#3b82f6", color:"#1d4ed8", fontWeight:700 },

  // 入力
  inp:       { width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b", fontSize:14, padding:"10px 13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color 0.15s" },
  ta:        { width:"100%", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b", fontSize:14, padding:"10px 13px", resize:"vertical", outline:"none", fontFamily:"inherit", lineHeight:1.75, boxSizing:"border-box", transition:"border-color 0.15s" },
  fieldBox:  { marginBottom:18, padding:"16px", background:"#f8fafc", borderRadius:10, border:"1px solid #e2e8f0" },
  fieldErr:  { borderColor:"#fca5a5", background:"#fff5f5" },

  // ボタン
  btnPrimary:{ display:"block", width:"100%", marginTop:24, padding:"14px", background:"#1d4ed8", color:"#fff", fontWeight:700, fontSize:15, border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"background 0.15s", letterSpacing:"0.02em" },
  btnOff:    { background:"#94a3b8", cursor:"not-allowed" },
  navRow:    { display:"flex", gap:12, marginTop:24 },
  btnBack:   { flex:"0 0 110px", padding:"13px", background:"#f1f5f9", color:"#64748b", fontWeight:600, fontSize:14, border:"1px solid #e2e8f0", borderRadius:10, cursor:"pointer", fontFamily:"inherit" },
  btnSample: { padding:"8px 16px", background:"#eff6ff", color:"#1d4ed8", fontWeight:700, fontSize:12, border:"1px solid #bfdbfe", borderRadius:8, cursor:"pointer", fontFamily:"inherit" },

  // バナー
  issueBanner:{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"14px 18px", marginBottom:20 },
  issueTitle: { color:"#c2410c", fontWeight:700, fontSize:14, margin:"0 0 4px" },
  issueSub:   { color:"#9a3412", fontSize:12, margin:"0 0 8px" },
  issueItem:  { color:"#c2410c", fontSize:12, margin:"3px 0" },
  okBanner:   { background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"13px 18px", marginBottom:20 },
  okText:     { color:"#15803d", fontWeight:700, fontSize:13, margin:0 },
  errMsg:     { color:"#dc2626", fontSize:13, margin:"0 0 10px", padding:"10px 14px", background:"#fff5f5", borderRadius:8, border:"1px solid #fca5a5" },

  // ローディング
  loadWrap:  { textAlign:"center", padding:"56px 20px" },
  ring:      { width:52, height:52, border:"3px solid #e2e8f0", borderTop:"3px solid #1d4ed8", borderRadius:"50%", animation:"spin 0.9s linear infinite", margin:"0 auto 24px" },
  loadTitle: { fontSize:17, fontWeight:800, color:"#1e293b", marginBottom:8 },
  loadMsg:   { fontSize:13, color:"#64748b", marginBottom:4 },
  loadSub:   { fontSize:12, color:"#94a3b8" },

  // 完了画面
  resultHeader:{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"16px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 },
  resultTitle: { fontSize:17, fontWeight:900, color:"#15803d", marginBottom:4 },
  resultSub:   { fontSize:12, color:"#166534" },
  actBtns:     { display:"flex", gap:8, flexWrap:"wrap" },
  btnCopy:     { padding:"9px 16px", background:"#1d4ed8", color:"#fff", fontWeight:700, fontSize:13, border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit" },
  btnCopyDone: { background:"#16a34a" },
  btnRegen:    { padding:"9px 16px", background:"#f1f5f9", color:"#334155", fontWeight:700, fontSize:13, border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontFamily:"inherit" },
  btnReset:    { padding:"9px 16px", background:"#fff", color:"#64748b", fontWeight:600, fontSize:13, border:"1px solid #e2e8f0", borderRadius:8, cursor:"pointer", fontFamily:"inherit" },

  // 出力エリア
  charBar:     { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  charLabel:   { fontSize:12, color:"#64748b", fontWeight:600 },
  charCount:   { fontSize:13, fontWeight:700, padding:"3px 12px", borderRadius:20 },
  charOk:      { background:"#f0fdf4", color:"#16a34a", border:"1px solid #bbf7d0" },
  charWarn:    { background:"#fff7ed", color:"#c2410c", border:"1px solid #fed7aa" },

  outputTa:    { width:"100%", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"16px", color:"#1e293b", fontSize:14, lineHeight:1.9, fontFamily:"'Noto Sans JP',sans-serif", boxSizing:"border-box", resize:"vertical", outline:"none", marginBottom:12, cursor:"text" },
  copyAllBtn:  { width:"100%", padding:"12px", background:"#1e3a5f", color:"#fff", fontWeight:700, fontSize:14, border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", marginBottom:16 },

  // アドバイスカード
  adviceCard:  { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"16px 18px", marginBottom:16 },
  adviceTitle: { fontSize:13, fontWeight:700, color:"#1d4ed8", marginBottom:8 },
  adviceText:  { fontSize:13, color:"#1e40af", lineHeight:1.75 },

  // 注意事項
  disclaimer:  { background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px 18px", marginTop:16 },
  disclaimerT: { fontSize:12, fontWeight:700, color:"#64748b", marginBottom:6 },
  disclaimerL: { fontSize:11, color:"#94a3b8", lineHeight:1.8 },

  // サマリータグ
  summary:     { display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 },
  tag:         { background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 },

  row2:        { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  footer:      { textAlign:"center", marginTop:40, padding:"0 20px", color:"#94a3b8", fontSize:11, lineHeight:1.8 },
};

// ─── メインコンポーネント ───────────────────────────────
export default function App() {
  const [page, setPage]         = useState(1);
  const [form, setForm]         = useState({ gender:"記載なし", age:"記載なし" });
  const [issues, setIssues]     = useState([]);
  const [output, setOutput]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [loadMsg, setLoadMsg]   = useState(0);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");
  const [charCount, setCharCount] = useState(0);
  const timerRef = useRef(null);

  const p   = form.prof;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const loadSample = () => {
    if (!p) return;
    const s = SAMPLES[p];
    setForm(f => ({ ...f, ...s }));
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
      setCharCount(extractAbstractBody(data.text).length);
      setPage(3);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      clearInterval(timerRef.current);
    }
  };

  const extractAbstractBody = (text) => {
    const match = text.match(/【抄録本文】([\s\S]*)/);
    return match ? match[1].trim() : text;
  };

  const copyText = (text, setter) => {
    try { navigator.clipboard.writeText(text); } catch {}
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy");
    document.body.removeChild(ta);
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const [copiedAll, setCopiedAll] = useState(false);

  const reset = () => {
    setForm({ gender:"記載なし", age:"記載なし" });
    setPage(1); setOutput(""); setIssues([]); setError(""); setCharCount(0);
    window.scrollTo(0, 0);
  };

  const errFields = issues.map(i => i.field);
  const fb = (field) => ({ ...s.fieldBox, ...(errFields.includes(field) && page===2 ? s.fieldErr : {}) });

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick}
      style={{ ...s.chip, ...(active ? s.chipOn : {}) }}
      onMouseOver={e => { if (!active) { e.target.style.borderColor="#3b82f6"; e.target.style.color="#1d4ed8"; }}}
      onMouseOut={e  => { if (!active) { e.target.style.borderColor="#e2e8f0"; e.target.style.color="#64748b"; }}}
    >{label}</button>
  );

  const Steps = () => (
    <div style={s.stepsWrap}>
      {["入力","確認・修正","生成完了"].map((label, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", flex: i<2?1:"auto" }}>
          <div style={s.stepItem}>
            <div style={{ ...s.stepCircle, ...(page===i+1?s.stepActive:page>i+1?s.stepDone:s.stepOff) }}>
              {page > i+1 ? "✓" : i+1}
            </div>
            <span style={{ ...s.stepLabel, ...(page===i+1?s.stepLabelActive:{}) }}>{label}</span>
          </div>
          {i < 2 && <div style={{ ...s.stepLine, ...(page>i+1?s.stepLineDone:{}) }} />}
        </div>
      ))}
    </div>
  );

  const wordLimitNum = () => {
    const m = (form.wordLimit||"").match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
  };

  const CharBadge = () => {
    const limit = wordLimitNum();
    if (!limit || !charCount) return null;
    const over = charCount > limit;
    return (
      <span style={{ ...s.charCount, ...(over ? s.charWarn : s.charOk) }}>
        {charCount} / {limit} 字 {over ? "⚠️ オーバー" : "✅ OK"}
      </span>
    );
  };

  return (
    <div style={s.root}>
      {/* トップバー */}
      <div style={s.topBar}>
        <span style={s.topLogo}>MediWork AI</span>
        <span style={s.topBadge}>医療職専用 学会抄録作成ツール</span>
      </div>

      {/* 注意バナー */}
      <div style={s.noticeBanner}>
        <span>⚠️</span>
        <span style={s.noticeText}>
          本ツールはAIによる文章支援ツールです。生成内容は必ずご自身で確認・修正してください。
          個人が特定される情報は入力しないでください。診断・治療目的ではありません。
        </span>
      </div>

      <div style={s.wrap}>
        {/* ヒーロー */}
        {page === 1 && (
          <div style={s.hero}>
            <div style={s.heroTag}>学会発表 AI支援ツール</div>
            <h1 style={s.heroH1}>学会抄録を、<br />3ステップで完成させる</h1>
            <p style={s.heroSub}>
              看護師・PT・OT・STの学会発表に特化した抄録生成ツールです。<br />
              臨床情報を入力するだけで、審査員に伝わる抄録を自動生成します。
            </p>
            <div style={s.heroFeats}>
              <span style={s.heroFeat}>✅ 職種別テンプレート対応</span>
              <span style={s.heroFeat}>✅ 字数制限を自動調整</span>
              <span style={s.heroFeat}>✅ タイトル案3つ生成</span>
              <span style={s.heroFeat}>✅ 考察・構成を自動整理</span>
            </div>
          </div>
        )}

        <Steps />

        {/* ── PAGE 1：入力 ── */}
        {page === 1 && (
          <div style={s.card}>
            <div style={s.cardTitle}>
              <span>📝</span>発表情報を入力してください
            </div>
            <div style={s.cardSub}>
              必須項目を入力して「確認する」を押してください。任意項目を充実させると抄録の質が上がります。
            </div>

            {/* サンプル読み込みバナー */}
            {p && (
              <div style={s.sampleBanner}>
                <span style={{ fontSize:20 }}>💡</span>
                <div>
                  <div style={s.sampleTitle}>入力例を参考にしますか？</div>
                  <div style={s.sampleText}>
                    {PROF_LABEL[p]}向けのサンプルデータを一括入力できます。
                    どんな内容を書けばいいか迷ったときにご活用ください。
                  </div>
                </div>
                <button style={s.btnSample} onClick={loadSample}>サンプルを読み込む</button>
              </div>
            )}

            {/* 職種選択 */}
            <div style={s.sec}>
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
              {/* カテゴリ */}
              <div style={s.sec}>
                <label style={s.lbl}>発表カテゴリ <span style={s.req}>必須</span></label>
                <div style={s.chips}>
                  {CATEGORIES[p].map(o => <Chip key={o} label={o} active={form.category===o} onClick={() => set("category",o)} />)}
                </div>
              </div>

              {/* 領域 */}
              <div style={s.sec}>
                <label style={s.lbl}>診療科・領域 <span style={s.req}>必須</span></label>
                <div style={s.chips}>
                  {FIELDS[p].map(o => <Chip key={o} label={o} active={form.field===o} onClick={() => set("field",o)} />)}
                </div>
              </div>

              {/* 疾患 */}
              <div style={s.sec}>
                <label style={s.lbl}>疾患・障害名 <span style={s.req}>必須</span></label>
                <input style={s.inp} value={form.disease||""}
                  onChange={e=>set("disease",e.target.value)}
                  placeholder={SAMPLES[p].disease}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 性別・年齢 */}
              <div style={s.row2}>
                <div style={s.sec}>
                  <label style={s.lbl}>性別 <span style={s.opt}>任意</span></label>
                  <div style={s.chips}>
                    {GENDERS.map(o => <Chip key={o} label={o} active={form.gender===o} onClick={() => set("gender",o)} />)}
                  </div>
                </div>
                <div style={s.sec}>
                  <label style={s.lbl}>年齢層 <span style={s.opt}>任意</span></label>
                  <div style={s.chips}>
                    {AGE_GROUPS.map(o => <Chip key={o} label={o} active={form.age===o} onClick={() => set("age",o)} />)}
                  </div>
                </div>
              </div>

              {/* タイトルイメージ */}
              <div style={s.sec}>
                <label style={s.lbl}>タイトルのイメージ <span style={s.req}>必須</span></label>
                <p style={s.hint}>キーワードでOKです。AIが3案に展開します</p>
                <input style={s.inp} value={form.titleImg||""}
                  onChange={e=>set("titleImg",e.target.value)}
                  placeholder={SAMPLES[p].titleImg}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 背景 */}
              <div style={s.sec}>
                <label style={s.lbl}>背景・動機・気づき <span style={s.req}>必須</span></label>
                <p style={s.hint}>「なぜこの症例を発表しようと思ったか」「臨床上どんな問題・疑問があったか」を書いてください</p>
                <textarea style={s.ta} rows={4} value={form.background||""}
                  onChange={e=>set("background",e.target.value)}
                  placeholder={SAMPLES[p].background}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 介入 */}
              <div style={s.sec}>
                <label style={s.lbl}>介入・取り組みの内容 <span style={s.req}>必須</span></label>
                <p style={s.hint}>何を・誰に・何回・どのように行ったか。回数・期間・評価指標があると質が上がります</p>
                <textarea style={s.ta} rows={4} value={form.intervention||""}
                  onChange={e=>set("intervention",e.target.value)}
                  placeholder={SAMPLES[p].intervention}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 結果 */}
              <div style={s.sec}>
                <label style={s.lbl}>結果・成果 <span style={s.req}>必須</span></label>
                <p style={s.hint}>数値（評価点数・期間・改善率）があると説得力が大幅に上がります</p>
                <textarea style={s.ta} rows={4} value={form.result||""}
                  onChange={e=>set("result",e.target.value)}
                  placeholder={SAMPLES[p].result}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 数値補足 */}
              <div style={s.sec}>
                <label style={s.lbl}>数値・期間の補足 <span style={s.opt}>任意</span></label>
                <textarea style={s.ta} rows={2} value={form.numbers||""}
                  onChange={e=>set("numbers",e.target.value)}
                  placeholder={SAMPLES[p].numbers}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 独自性 */}
              <div style={s.sec}>
                <label style={s.lbl}>なぜうまくいったと思いますか？ <span style={s.opt}>任意・考察の核になります</span></label>
                <textarea style={s.ta} rows={3} value={form.uniqueness||""}
                  onChange={e=>set("uniqueness",e.target.value)}
                  placeholder={SAMPLES[p].uniqueness}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 差別化 */}
              <div style={s.sec}>
                <label style={s.lbl}>他と違うと感じた点 <span style={s.opt}>任意・新規性の根拠になります</span></label>
                <textarea style={s.ta} rows={3} value={form.difference||""}
                  onChange={e=>set("difference",e.target.value)}
                  placeholder={SAMPLES[p].difference}
                  onFocus={e=>e.target.style.borderColor="#3b82f6"}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>

              {/* 字数制限 */}
              <div style={s.sec}>
                <label style={s.lbl}>抄録の字数制限 <span style={s.req}>必須</span></label>
                <div style={s.chips}>
                  {WORD_LIMITS.map(o => <Chip key={o} label={o} active={form.wordLimit===o} onClick={() => set("wordLimit",o)} />)}
                </div>
              </div>

              <button onClick={goConfirm}
                style={s.btnPrimary}
                onMouseOver={e=>e.target.style.background="#1e40af"}
                onMouseOut={e=>e.target.style.background="#1d4ed8"}>
                内容を確認する →
              </button>
            </>}

            {!p && (
              <p style={{ color:"#94a3b8", fontSize:14, textAlign:"center", marginTop:16, padding:"20px 0" }}>
                ↑ まず職種を選択してください
              </p>
            )}
          </div>
        )}

        {/* ── PAGE 2：確認 ── */}
        {page === 2 && (
          <div style={s.card}>
            <div style={s.cardTitle}><span>🔍</span>内容を確認・修正してください</div>

            {issues.length > 0 ? (
              <div style={s.issueBanner}>
                <p style={s.issueTitle}>⚠️ {issues.length}件の改善点があります</p>
                <p style={s.issueSub}>赤枠の項目を修正してから生成してください（スキップも可能です）</p>
                {issues.map((issue,i) => <p key={i} style={s.issueItem}>• {issue.msg}</p>)}
              </div>
            ) : (
              <div style={s.okBanner}>
                <p style={s.okText}>✅ 情報は十分です！このまま生成できます。</p>
              </div>
            )}

            {/* 確認フォーム */}
            <div style={fb("prof")}>
              <label style={s.lbl}>職種</label>
              <div style={s.profGrid}>
                {PROFS.map(pr => (
                  <button key={pr.id} onClick={() => set("prof",pr.id)}
                    style={{ ...s.profCard, ...(form.prof===pr.id?s.profCardOn:{}) }}>
                    <span style={s.profIcon}>{pr.icon}</span>
                    <div><div style={s.profLbl}>{pr.label}</div><div style={s.profDesc}>{pr.desc}</div></div>
                  </button>
                ))}
              </div>
            </div>

            <div style={fb("category")}>
              <label style={s.lbl}>発表カテゴリ</label>
              <div style={s.chips}>
                {CATEGORIES[p||"nurse"].map(o => <Chip key={o} label={o} active={form.category===o} onClick={() => set("category",o)} />)}
              </div>
            </div>

            <div style={fb("field")}>
              <label style={s.lbl}>診療科・領域</label>
              <div style={s.chips}>
                {FIELDS[p||"nurse"].map(o => <Chip key={o} label={o} active={form.field===o} onClick={() => set("field",o)} />)}
              </div>
            </div>

            <div style={fb("disease")}>
              <label style={s.lbl}>疾患・障害名</label>
              <input style={s.inp} value={form.disease||""} onChange={e=>set("disease",e.target.value)} />
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <div style={{ ...fb("gender"), flex:1 }}>
                <label style={s.lbl}>性別</label>
                <div style={s.chips}>{GENDERS.map(o => <Chip key={o} label={o} active={form.gender===o} onClick={() => set("gender",o)} />)}</div>
              </div>
              <div style={{ ...fb("age"), flex:1 }}>
                <label style={s.lbl}>年齢層</label>
                <div style={s.chips}>{AGE_GROUPS.map(o => <Chip key={o} label={o} active={form.age===o} onClick={() => set("age",o)} />)}</div>
              </div>
            </div>

            <div style={fb("titleImg")}>
              <label style={s.lbl}>タイトルのイメージ</label>
              <input style={s.inp} value={form.titleImg||""} onChange={e=>set("titleImg",e.target.value)} />
            </div>

            <div style={fb("background")}>
              <label style={s.lbl}>背景・動機・気づき</label>
              <textarea style={s.ta} rows={4} value={form.background||""} onChange={e=>set("background",e.target.value)} />
            </div>

            <div style={fb("intervention")}>
              <label style={s.lbl}>介入・取り組みの内容</label>
              <textarea style={s.ta} rows={4} value={form.intervention||""} onChange={e=>set("intervention",e.target.value)} />
            </div>

            <div style={fb("result")}>
              <label style={s.lbl}>結果・成果</label>
              <textarea style={s.ta} rows={4} value={form.result||""} onChange={e=>set("result",e.target.value)} />
            </div>

            <div style={s.fieldBox}>
              <label style={s.lbl}>数値・期間の補足</label>
              <textarea style={s.ta} rows={2} value={form.numbers||""} onChange={e=>set("numbers",e.target.value)} />
            </div>

            <div style={s.fieldBox}>
              <label style={s.lbl}>なぜうまくいったか</label>
              <textarea style={s.ta} rows={3} value={form.uniqueness||""} onChange={e=>set("uniqueness",e.target.value)} />
            </div>

            <div style={s.fieldBox}>
              <label style={s.lbl}>他と違うと感じた点</label>
              <textarea style={s.ta} rows={3} value={form.difference||""} onChange={e=>set("difference",e.target.value)} />
            </div>

            <div style={fb("wordLimit")}>
              <label style={s.lbl}>字数制限</label>
              <div style={s.chips}>
                {WORD_LIMITS.map(o => <Chip key={o} label={o} active={form.wordLimit===o} onClick={() => set("wordLimit",o)} />)}
              </div>
            </div>

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

        {/* ── ローディング ── */}
        {loading && (
          <div style={{ ...s.card, marginTop:0 }}>
            <div style={s.loadWrap}>
              <div style={s.ring} />
              <div style={s.loadTitle}>ただいま作成中...</div>
              <div style={s.loadMsg}>{LOADING_MSGS[loadMsg]}</div>
              <div style={s.loadSub}>抄録・タイトル案を生成しています。少々お待ちください。</div>
            </div>
          </div>
        )}

        {/* ── PAGE 3：完了 ── */}
        {page === 3 && output && (
          <div style={s.card}>
            {/* 完了ヘッダー */}
            <div style={s.resultHeader}>
              <div>
                <div style={s.resultTitle}>✅ 抄録が完成しました！</div>
                <div style={s.resultSub}>
                  【　】に実際の数値を入れて完成させてください。内容は直接編集できます。
                </div>
              </div>
              <div style={s.actBtns}>
                <button onClick={generate} style={s.btnRegen}>🔄 再生成</button>
                <button onClick={reset}    style={s.btnReset}>🆕 最初から</button>
              </div>
            </div>

            {/* サマリータグ */}
            <div style={s.summary}>
              {[["職種",PROF_LABEL[form.prof]],["カテゴリ",form.category],["診療科",form.field],["疾患",form.disease],["字数",form.wordLimit]]
                .filter(([,v])=>v).map(([k,v])=><span key={k} style={s.tag}>{k}：{v}</span>)}
            </div>

            {/* 字数カウント */}
            <div style={s.charBar}>
              <span style={s.charLabel}>抄録本文字数</span>
              <CharBadge />
            </div>

            {/* 出力テキストエリア */}
            <textarea
              style={s.outputTa} rows={24}
              value={output}
              onChange={e => {
                setOutput(e.target.value);
                setCharCount(extractAbstractBody(e.target.value).length);
              }}
              onFocus={e=>e.target.style.borderColor="#3b82f6"}
              onBlur={e=>e.target.style.borderColor="#e2e8f0"}
            />

            {/* 全文コピー */}
            <button
              style={{ ...s.copyAllBtn, ...(copiedAll?{ background:"#16a34a" }:{}) }}
              onClick={() => copyText(output, setCopiedAll)}
              onMouseOver={e=>{ if(!copiedAll) e.target.style.background="#1e3a5f"; }}
              onMouseOut={e=>{ if(!copiedAll) e.target.style.background="#1e3a5f"; }}
            >
              {copiedAll ? "✓ コピー完了！" : "📋 全文をコピーする"}
            </button>

            {/* アドバイスカード */}
            <div style={s.adviceCard}>
              <div style={s.adviceTitle}>💡 さらに精度を上げるには</div>
              <div style={s.adviceText}>
                この抄録をClaude.aiに貼り付けて、以下のように依頼すると仕上がりが上がります：<br />
                「考察をもっと具体的に」「字数を〇〇字以内に収めて」「タイトルをより新規性のある表現に」
              </div>
            </div>

            {/* 免責事項 */}
            <div style={s.disclaimer}>
              <div style={s.disclaimerT}>⚠️ ご利用にあたって</div>
              <div style={s.disclaimerL}>
                • 本ツールはAIによる文章支援ツールです。生成内容は必ずご自身で確認・修正してください。<br />
                • 【　】で示された数値は入力情報に含まれていなかった箇所です。実際の数値に置き換えてください。<br />
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
