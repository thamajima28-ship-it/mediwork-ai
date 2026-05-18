"use client";
import { useState } from "react";

const CATEGORIES = {
  nurse: ["症例報告","看護研究","実践報告","チーム医療報告","その他"],
  pt:    ["症例報告","臨床研究","実践報告","チーム医療報告","その他"],
  ot:    ["症例報告","臨床研究","実践報告","チーム医療報告","その他"],
  st:    ["症例報告","臨床研究","実践報告","チーム医療報告","その他"],
};

const FIELDS = {
  nurse: ["急性期・ICU","救急","循環器","呼吸器","消化器","脳外科・脳神経内科","整形外科","精神科","外来・地域","その他"],
  pt:    ["急性期","回復期","維持期・生活期","地域","運動器","神経疾患","循環器・呼吸器","高齢者","その他"],
  ot:    ["急性期","回復期","維持期・生活期","運動器","神経疾患","高次脳機能障害","内部障害","精神科","その他"],
  st:    ["急性期","回復期","維持期・生活期","嚥下障害","失語症","高次脳機能障害","聴覚障害","小児","その他"],
};

const PROF_LABEL = { nurse:"看護師", pt:"理学療法士", ot:"作業療法士", st:"言語聴覚士" };
const PROF_ICON  = { nurse:"🩺", pt:"🦵", ot:"🖐️", st:"🗣️" };
const WORD_LIMITS = ["400字以内","500字以内","600字以内","800字以内","1000字以内","指定なし"];
const GENDERS = ["男性","女性","記載なし"];
const AGE_GROUPS = ["10歳代","20歳代","30歳代","40歳代","50歳代","60歳代","70歳代","80歳代","90歳代以上","記載なし"];

const DISEASE_PH = {
  nurse: "例：急性心不全、大腿骨頸部骨折",
  pt:    "例：脳梗塞（左片麻痺）、変形性膝関節症",
  ot:    "例：脳出血（右片麻痺・失語）、認知症",
  st:    "例：脳梗塞後遺症（嚥下障害・失語症）",
};

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
【背景・動機】
${f.background}

【介入・取り組み内容】
${f.intervention}

【結果・成果】
${f.result}

【数値・期間の補足】
${f.numbers || "記載なし"}

【なぜうまくいったか】
${f.uniqueness || "記載なし"}

【他と違うと感じた点】
${f.difference || "記載なし"}

■ 出力形式

【タイトル案（3案）】
1.
2.
3.

【抄録本文】

- 字数制限「${f.wordLimit}」に厳密に収めること
- 構成：はじめに → 事例紹介 → 結果 → 考察・まとめ
- 入力にない数値は【　】で空白にすること
- 患者個人が特定されない表現を使うこと
- 「なぜうまくいったか」の解釈を考察の中心に据えること
- 「この事例ならでは」の視点を1文以上入れること
- タイトル案は新規性・独自性が伝わる表現にすること
- 領域に応じた評価指標・用語を適切に補完すること`;

const checkIssues = (f) => {
  const issues = [];
  if (!f.prof)                       issues.push({ field:"prof",         msg:"職種を選択してください" });
  if (!f.category)                   issues.push({ field:"category",     msg:"発表カテゴリを選択してください" });
  if (!f.field)                      issues.push({ field:"field",        msg:"診療科・領域を選択してください" });
  if (!f.disease?.trim())            issues.push({ field:"disease",      msg:"疾患名を入力してください" });
  if (!f.titleImg?.trim())           issues.push({ field:"titleImg",     msg:"タイトルのイメージを入力してください" });
  if ((f.background||"").length<20)  issues.push({ field:"background",   msg:"背景・動機がやや短いです" });
  if ((f.intervention||"").length<20)issues.push({ field:"intervention", msg:"介入内容がやや短いです" });
  if (!/[0-9０-９]/.test(f.result||""))issues.push({ field:"result",    msg:"結果に数値を入れると質が上がります" });
  if (!f.wordLimit)                  issues.push({ field:"wordLimit",    msg:"字数制限を選択してください" });
  return issues;
};

const s = {
  root:      { minHeight:"100vh", background:"#080d1a", fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", position:"relative", overflowX:"hidden" },
  bgGrid:    { position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(6,182,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.04) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0 },
  wrap:      { position:"relative", zIndex:1, maxWidth:720, margin:"0 auto", padding:"40px 20px 80px" },
  header:    { textAlign:"center", marginBottom:32 },
  badge:     { display:"inline-block", background:"linear-gradient(135deg,#06b6d4,#0891b2)", color:"#fff", fontSize:11, fontWeight:700, letterSpacing:"0.15em", padding:"4px 14px", borderRadius:20, marginBottom:14 },
  h1:        { fontSize:26, fontWeight:900, color:"#f0f9ff", margin:"0 0 8px", letterSpacing:"-0.02em" },
  sub:       { fontSize:13, color:"#94a3b8", margin:"0 0 24px" },
  steps:     { display:"flex", alignItems:"center", justifyContent:"center" },
  stepItem:  { display:"flex", alignItems:"center", gap:6 },
  stepCircle:{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 },
  stepActive:{ background:"#06b6d4", color:"#fff" },
  stepDone:  { background:"#0e7490", color:"#fff" },
  stepOff:   { background:"#1e293b", color:"#475569", border:"1px solid #334155" },
  stepLabel: { fontSize:11, color:"#64748b", marginRight:4 },
  stepLine:  { width:32, height:2, background:"#1e293b", margin:"0 4px" },
  stepLineDone:{ background:"#0e7490" },
  card:      { background:"rgba(15,23,42,0.97)", border:"1px solid rgba(6,182,212,0.2)", borderRadius:18, padding:"32px 28px", boxShadow:"0 4px 40px rgba(6,182,212,0.06)" },
  cardTitle: { fontSize:18, fontWeight:800, color:"#f0f9ff", margin:"0 0 8px" },
  cardSub:   { fontSize:13, color:"#64748b", margin:"0 0 28px", lineHeight:1.7 },
  sec:       { marginBottom:24 },
  lbl:       { display:"block", fontSize:13, fontWeight:700, color:"#cbd5e1", marginBottom:10 },
  req:       { color:"#06b6d4", fontSize:11, marginLeft:4 },
  hint:      { fontSize:12, color:"#64748b", margin:"-6px 0 10px", lineHeight:1.7, borderLeft:"3px solid #06b6d4", paddingLeft:10 },
  profGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  profCard:  { display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"18px 12px", background:"#0f172a", border:"1px solid #334155", borderRadius:12, cursor:"pointer", transition:"all 0.2s" },
  profCardOn:{ background:"rgba(6,182,212,0.12)", borderColor:"#06b6d4" },
  profIcon:  { fontSize:28 },
  profLbl:   { fontSize:13, fontWeight:700, color:"#e2e8f0" },
  chips:     { display:"flex", flexWrap:"wrap", gap:8 },
  chip:      { padding:"7px 14px", borderRadius:8, border:"1px solid #334155", background:"#1e293b", color:"#94a3b8", fontSize:13, cursor:"pointer", fontFamily:"inherit" },
  chipOn:    { background:"rgba(6,182,212,0.15)", borderColor:"#06b6d4", color:"#06b6d4", fontWeight:700 },
  inp:       { width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:10, color:"#e2e8f0", fontSize:14, padding:"11px 14px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  ta:        { width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:10, color:"#e2e8f0", fontSize:14, padding:"11px 14px", resize:"vertical", outline:"none", fontFamily:"inherit", lineHeight:1.7, boxSizing:"border-box" },
  fieldBox:  { marginBottom:20, padding:16, background:"#0a1628", borderRadius:12, border:"1px solid #1e293b" },
  fieldErr:  { borderColor:"#ef4444", background:"rgba(239,68,68,0.05)" },
  btnPrimary:{ display:"block", width:"100%", marginTop:28, padding:14, background:"linear-gradient(135deg,#06b6d4,#0891b2)", color:"#fff", fontWeight:700, fontSize:15, border:"none", borderRadius:10, cursor:"pointer", letterSpacing:"0.03em", fontFamily:"inherit" },
  btnOff:    { background:"#1e293b", color:"#475569", cursor:"not-allowed" },
  navRow:    { display:"flex", gap:12, marginTop:28 },
  btnBack:   { flex:"0 0 120px", padding:14, background:"#1e293b", color:"#94a3b8", fontWeight:600, fontSize:14, border:"1px solid #334155", borderRadius:10, cursor:"pointer", fontFamily:"inherit" },
  issueBanner:{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:12, padding:"16px 20px", marginBottom:24 },
  issueTitle: { color:"#fbbf24", fontWeight:700, fontSize:14, margin:"0 0 4px" },
  issueSub:   { color:"#94a3b8", fontSize:13, margin:"0 0 10px" },
  issueItem:  { color:"#fbbf24", fontSize:13, margin:"4px 0" },
  okBanner:   { background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:12, padding:"14px 20px", marginBottom:24 },
  okText:     { color:"#34d399", fontWeight:700, fontSize:14, margin:0 },
  errMsg:     { color:"#f87171", fontSize:13, margin:"0 0 12px" },
  loadWrap:   { textAlign:"center", padding:"60px 20px" },
  ring:       { width:56, height:56, border:"3px solid rgba(6,182,212,0.15)", borderTop:"3px solid #06b6d4", borderRadius:"50%", animation:"spin 0.9s linear infinite", margin:"0 auto 28px" },
  loadTitle:  { fontSize:18, fontWeight:800, color:"#f0f9ff", marginBottom:8 },
  loadSub:    { fontSize:13, color:"#94a3b8", lineHeight:1.8 },
  doneTop:    { display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:20 },
  doneTitle:  { fontSize:18, fontWeight:900, color:"#06b6d4", marginBottom:4 },
  doneSub:    { fontSize:13, color:"#64748b" },
  doneActs:   { display:"flex", gap:8 },
  btnCopy:    { padding:"9px 18px", background:"linear-gradient(135deg,#06b6d4,#0891b2)", color:"#fff", fontWeight:700, fontSize:13, border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit" },
  btnReset:   { padding:"9px 16px", background:"#1e293b", color:"#94a3b8", fontWeight:600, fontSize:13, border:"1px solid #334155", borderRadius:8, cursor:"pointer", fontFamily:"inherit" },
  summary:    { display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 },
  tag:        { background:"rgba(6,182,212,0.1)", border:"1px solid rgba(6,182,212,0.25)", color:"#06b6d4", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 },
  outputTa:   { width:"100%", background:"#050a14", border:"1px solid #1e293b", borderRadius:12, padding:16, color:"#e2e8f0", fontSize:14, lineHeight:1.9, fontFamily:"'Noto Sans JP',sans-serif", boxSizing:"border-box", resize:"vertical", outline:"none", marginBottom:16, cursor:"text" },
  tip:        { background:"rgba(6,182,212,0.04)", border:"1px solid rgba(6,182,212,0.12)", borderRadius:10, padding:"12px 16px" },
  tipTitle:   { color:"#06b6d4", fontSize:13, fontWeight:700, marginBottom:4 },
  tipText:    { color:"#64748b", fontSize:12, lineHeight:1.7 },
  footer:     { textAlign:"center", marginTop:40, color:"#1e293b", fontSize:12 },
  row2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
};

export default function App() {
  const [page, setPage]     = useState(1);
  const [form, setForm]     = useState({ gender:"記載なし", age:"記載なし" });
  const [issues, setIssues] = useState([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState("");

  const p  = form.prof;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const goConfirm = () => {
    setIssues(checkIssues(form));
    setPage(2);
    window.scrollTo(0, 0);
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(form) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      setOutput(data.text);
      setPage(3);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    const el = document.getElementById("out-ta");
    if (!el) return;
    el.select(); el.setSelectionRange(0, 99999);
    try { document.execCommand("copy"); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const reset = () => {
    setForm({ gender:"記載なし", age:"記載なし" });
    setPage(1); setOutput(""); setIssues([]); setError("");
    window.scrollTo(0, 0);
  };

  const errFields = issues.map(i => i.field);
  const fb = (field) => ({ ...s.fieldBox, ...(errFields.includes(field) && page===2 ? s.fieldErr : {}) });

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{ ...s.chip, ...(active ? s.chipOn : {}) }}>{label}</button>
  );

  const Steps = () => (
    <div style={s.steps}>
      {["入力","確認・修正","生成完了"].map((label, i) => (
        <div key={i} style={s.stepItem}>
          <div style={{ ...s.stepCircle, ...(page===i+1?s.stepActive:page>i+1?s.stepDone:s.stepOff) }}>
            {page > i+1 ? "✓" : i+1}
          </div>
          <span style={{ ...s.stepLabel, ...(page===i+1?{color:"#06b6d4"}:{}) }}>{label}</span>
          {i < 2 && <div style={{ ...s.stepLine, ...(page>i+1?s.stepLineDone:{}) }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div style={s.root}>
      <div style={s.bgGrid} />
      <div style={s.wrap}>

        <div style={s.header}>
          <div style={s.badge}>医療職専用</div>
          <h1 style={s.h1}>学会抄録 作成ツール</h1>
          <p style={s.sub}>入力して確認 → 生成の3ステップで完成</p>
          <Steps />
        </div>

        {/* ── PAGE 1：入力 ── */}
        {page === 1 && (
          <div style={s.card}>
            <div style={s.cardTitle}>発表情報を入力してください</div>
            <div style={s.cardSub}>すべての項目を入力して「確認する」を押してください</div>

            {/* 職種 */}
            <div style={s.sec}>
              <label style={s.lbl}>職種 <span style={s.req}>必須</span></label>
              <div style={s.profGrid}>
                {["nurse","pt","ot","st"].map(id => (
                  <button key={id} onClick={() => set("prof", id)}
                    style={{ ...s.profCard, ...(form.prof===id ? s.profCardOn : {}) }}>
                    <span style={s.profIcon}>{PROF_ICON[id]}</span>
                    <span style={s.profLbl}>{PROF_LABEL[id]}</span>
                  </button>
                ))}
              </div>
            </div>

            {p && <>
              <div style={s.sec}>
                <label style={s.lbl}>発表カテゴリ <span style={s.req}>必須</span></label>
                <div style={s.chips}>
                  {CATEGORIES[p].map(o => <Chip key={o} label={o} active={form.category===o} onClick={() => set("category",o)} />)}
                </div>
              </div>

              <div style={s.sec}>
                <label style={s.lbl}>診療科・領域 <span style={s.req}>必須</span></label>
                <div style={s.chips}>
                  {FIELDS[p].map(o => <Chip key={o} label={o} active={form.field===o} onClick={() => set("field",o)} />)}
                </div>
              </div>

              <div style={s.sec}>
                <label style={s.lbl}>疾患・障害名 <span style={s.req}>必須</span></label>
                <input style={s.inp} value={form.disease||""} onChange={e=>set("disease",e.target.value)} placeholder={DISEASE_PH[p]} />
              </div>

              <div style={s.row2}>
                <div style={s.sec}>
                  <label style={s.lbl}>性別</label>
                  <div style={s.chips}>
