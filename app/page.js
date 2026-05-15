"use client";

import { useState } from "react";

const PROFESSIONS = [
  { id: "nurse", label: "看護師",    icon: "🩺" },
  { id: "pt",    label: "理学療法士", icon: "🦵" },
  { id: "ot",    label: "作業療法士", icon: "🖐️" },
  { id: "st",    label: "言語聴覚士", icon: "🗣️" },
];

const CATEGORIES = {
  nurse: ["症例報告", "看護研究", "実践報告", "チーム医療報告", "その他"],
  pt:    ["症例報告", "臨床研究", "実践報告", "チーム医療報告", "その他"],
  ot:    ["症例報告", "臨床研究", "実践報告", "チーム医療報告", "その他"],
  st:    ["症例報告", "臨床研究", "実践報告", "チーム医療報告", "その他"],
};

const FIELDS = {
  nurse: ["急性期・ICU", "救急", "循環器", "呼吸器", "消化器", "脳外科・脳神経内科", "整形外科", "精神科", "外来・地域", "その他"],
  pt:    ["急性期", "回復期", "維持期・生活期", "地域", "運動器", "神経疾患", "循環器・呼吸器", "高齢者", "その他"],
  ot:    ["急性期", "回復期", "維持期・生活期", "運動器", "神経疾患", "高次脳機能障害", "内部障害", "精神科", "その他"],
  st:    ["急性期", "回復期", "維持期・生活期", "嚥下障害", "失語症", "高次脳機能障害", "聴覚障害", "小児", "その他"],
};

const GENDERS    = ["男性", "女性", "記載なし"];
const AGE_GROUPS = ["10歳代", "20歳代", "30歳代", "40歳代", "50歳代", "60歳代", "70歳代", "80歳代", "90歳代以上", "記載なし"];
const WORD_LIMITS = ["400字以内", "500字以内", "600字以内", "800字以内", "1000字以内", "指定なし"];

const PROF_LABEL = { nurse: "看護師", pt: "理学療法士", ot: "作業療法士", st: "言語聴覚士" };

const PLACEHOLDERS = {
  nurse: {
    disease: "例：急性心不全、大腿骨頸部骨折",
    title: "例：退院指導の工夫、せん妄予防への関わり",
    background: "例：退院指導をしても再入院を繰り返す患者がいた。\n\n💡 良い例：同疾患の再入院が〇ヶ月で〇件続いた。従来の口頭説明では理解が定着しないと感じた。",
    intervention: "例：本人・妻にパンフレットを用いて計4回指導した。\n\n💡 良い例：退院3日前より本人・妻にパンフレットを使用し計4回指導。毎回5段階で理解度を評価した。",
    result: "例：退院3ヶ月後の外来受診時に再入院なし。\n\n💡 良い例：退院後〇ヶ月間再入院なし。体重記録表を持参し〇kgの変動幅で管理できていた。",
    numbers: "例：入院期間14日、退院後3ヶ月観察、指導4回実施",
    uniqueness: "例：家族を巻き込んだことで患者の動機が上がったと思う。",
    difference: "例：患者が自分から質問してきた。退院後も外来で報告してくれた。",
  },
  pt: {
    disease: "例：脳梗塞（左片麻痺）、変形性膝関節症",
    title: "例：歩行能力改善、バランス訓練、早期離床",
    background: "例：標準的なアプローチでは歩行改善が得られなかった。\n\n💡 良い例：入院〇日経過しても歩行能力が改善せず、評価を再検討した結果〇〇が原因と判明した。",
    intervention: "例：バランス訓練を1日2回・計20回実施。BBS・TUGで評価した。\n\n💡 良い例：〇〇訓練を週〇回・計〇回実施。評価はBBS・10m歩行を介入前後で比較した。",
    result: "例：BBS 32→48点、TUG 18→11秒に改善。\n\n💡 良い例：BBS〇→〇点、10m歩行〇→〇秒に改善。〇週後に病棟内歩行自立・退院となった。",
    numbers: "例：入院60日、訓練週5回×8週、BBS/TUG/10m歩行で評価",
    uniqueness: "例：従来の筋力訓練ではなく感覚フィードバックに着目した点が違ったと思う。",
    difference: "例：患者が積極的に自主訓練を行うようになった。",
  },
  ot: {
    disease: "例：脳出血（右片麻痺・失語）、認知症",
    title: "例：食事動作の自立、復職支援、認知症への作業療法",
    background: "例：高次脳機能障害により食事動作が自立しなかった。\n\n💡 良い例：〇〇障害により食事動作が自立困難で、入院〇週時点でFIM〇点と改善が乏しかった。",
    intervention: "例：食事動作訓練を1日1回・計15回実施。FIMで評価した。\n\n💡 良い例：〇〇を用いた食事動作訓練を週〇回実施。FIMの食事項目で経過評価した。",
    result: "例：FIM食事項目 3→6点に改善。スプーン操作が自立した。\n\n💡 良い例：FIM合計〇→〇点に改善。〇週後に食事動作自立し退院時FIM〇点となった。",
    numbers: "例：入院45日、訓練週5回×6週、FIM/MAMSで評価",
    uniqueness: "例：作業の意味づけを重視し患者が好きな活動を訓練に取り入れた点が違う。",
    difference: "例：患者の表情が明るくなった。家族から「本人らしさが戻った」と言われた。",
  },
  st: {
    disease: "例：脳梗塞後遺症（嚥下障害・失語症）",
    title: "例：嚥下機能改善、失語症への介入、VF検査後の訓練",
    background: "例：誤嚥リスクが高く経口摂取が困難だった。\n\n💡 良い例：入院時より誤嚥性肺炎を反復し、VF検査で咽頭残留を認めた。",
    intervention: "例：間接訓練を1日2回、直接訓練をトロミ食から開始した。\n\n💡 良い例：間接訓練を1日2回、直接訓練を週〇回実施。FILS・EATINGで経過評価した。",
    result: "例：FILS Lv.3→6に改善。トロミ食から全粥食へ移行できた。\n\n💡 良い例：FILS〇→〇、EATING〇→〇点に改善。〇週後にトロミ食→全粥食へ移行した。",
    numbers: "例：入院30日、訓練週5回×4週、VF2回実施、FILS/EATINGで評価",
    uniqueness: "例：姿勢調整と食形態の段階的変更を組み合わせた点が違ったと思う。",
    difference: "例：患者が「食べることが楽しみになった」と話してくれた。",
  },
};

const buildPrompt = (form) => {
  const patientInfo = [
    form.disease,
    form.gender !== "記載なし" ? form.gender : null,
    form.age !== "記載なし" ? form.age : null,
  ].filter(Boolean).join("・");

  return `あなたは${PROF_LABEL[form.prof]}の学会発表・抄録作成を専門とするアドバイザーです。
以下の情報をもとに、学会抄録を作成してください。

■ 発表者情報
職種：${PROF_LABEL[form.prof]}
カテゴリ：${form.category}
診療科・領域：${form.field}
患者情報：${patientInfo || "記載なし"}
タイトルイメージ：${form.title}
字数制限：${form.wordLimit}

■ 発表内容
【背景・動機】
${form.background}

【介入・取り組み内容】
${form.intervention}

【結果・成果】
${form.result}

【数値・期間の補足】
${form.numbers || "記載なし"}

【なぜうまくいったか（本人の解釈）】
${form.uniqueness || "記載なし"}

【他と違うと感じた点】
${form.difference || "記載なし"}

■ 出力形式

【タイトル案（3案）】
1.
2.
3.

【抄録本文】
- 字数制限「${form.wordLimit}」に厳密に収めること
- 構成：はじめに → 事例紹介 → 結果 → 考察・まとめ
- 入力にない数値は【　】で空白にすること
- 患者個人が特定されない表現を使うこと
- 「なぜうまくいったか」の解釈を考察の中心に据えること
- 「この事例ならでは」の視点を1文以上入れること
- タイトル案は新規性・独自性が伝わる表現にすること
- 領域に応じた評価指標・用語を適切に補完すること
- 補完した数値は必ず【　】で空白にすること`;
};

const checkIssues = (form) => {
  const issues = [];
  const hasNum = (s) => /[0-9０-９]/.test(s || "");
  if (!form.prof)                            issues.push({ field: "prof",         msg: "職種を選択してください" });
  if (!form.category)                        issues.push({ field: "category",     msg: "発表カテゴリを選択してください" });
  if (!form.field)                           issues.push({ field: "field",        msg: "診療科・領域を選択してください" });
  if (!form.disease?.trim())                 issues.push({ field: "disease",      msg: "疾患名を入力してください" });
  if (!form.gender)                          issues.push({ field: "gender",       msg: "性別を選択してください" });
  if (!form.age)                             issues.push({ field: "age",          msg: "年齢層を選択してください" });
  if (!form.title?.trim())                   issues.push({ field: "title",        msg: "タイトルのイメージを入力してください" });
  if ((form.background || "").length < 20)   issues.push({ field: "background",   msg: "背景・動機がやや短いです。もう少し具体的に書いてください" });
  if ((form.intervention || "").length < 20) issues.push({ field: "intervention", msg: "介入内容がやや短いです。何を・何回・どのように行ったか書いてください" });
  if (!hasNum(form.result))                  issues.push({ field: "result",       msg: "結果に数値がありません。評価点数・期間・回数など数値を入れると抄録の質が上がります" });
  if (!form.wordLimit)                       issues.push({ field: "wordLimit",    msg: "字数制限を選択してください" });
  return issues;
};
export default function App() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ gender: "記載なし", age: "記載なし" });
  const [issues, setIssues] = useState([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const p = form.prof;
  const ph = p ? PLACEHOLDERS[p] : {};
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const goToConfirm = () => {
    const found = checkIssues(form);
    setIssues(found);
    setPage(2);
    window.scrollTo(0, 0);
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: buildPrompt(form) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.content);
      setPage(3);
      window.scrollTo(0, 0);
    } catch (e) {
      setError("生成に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    const el = document.getElementById("output-ta");
    if (!el) return;
    el.select(); el.setSelectionRange(0, 99999);
    try { document.execCommand("copy"); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const reset = () => { setForm({ gender: "記載なし", age: "記載なし" }); setPage(1); setOutput(""); setIssues([]); setError(""); window.scrollTo(0, 0); };

  const issueFields = issues.map(i => i.field);
  const fieldStyle = (field) => ({ ...s.fieldBox, ...(issueFields.includes(field) ? s.fieldBoxError : {}) });

  return (
    <div style={s.root}>
      <div style={s.bgGrid} />
      <div style={s.wrap}>
        <header style={s.header}>
          <div style={s.badge}>医療職専用</div>
          <h1 style={s.title}>学会抄録 作成ツール</h1>
          <p style={s.sub}>入力して確認 → 生成の3ステップで完成</p>
          <div style={s.steps}>
            {["入力", "確認・修正", "生成完了"].map((label, i) => (
              <div key={i} style={s.stepItem}>
                <div style={{ ...s.stepCircle, ...(page === i+1 ? s.stepActive : page > i+1 ? s.stepDone : s.stepInactive) }}>
                  {page > i+1 ? "✓" : i+1}
                </div>
                <span style={{ ...s.stepLabel, ...(page === i+1 ? { color: "#06b6d4" } : {}) }}>{label}</span>
                {i < 2 && <div style={{ ...s.stepLine, ...(page > i+1 ? s.stepLineDone : {}) }} />}
              </div>
            ))}
          </div>
        </header>

        {/* PAGE 1 */}
        {page === 1 && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>発表情報を入力してください</h2>
            <p style={s.cardSub}>すべての項目を入力して、最後に「確認する」を押してください</p>

            <div style={s.section}>
              <label style={s.label}>職種 <span style={s.required}>必須</span></label>
              <div style={s.profGrid}>
                {PROFESSIONS.map(pr => (
                  <button key={pr.id} onClick={() => set("prof", pr.id)}
                    style={{ ...s.profCard, ...(form.prof === pr.id ? s.profCardOn : {}) }}>
                    <span style={s.profIcon}>{pr.icon}</span>
                    <span style={s.profLabel}>{pr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {p && <>
              <div style={s.section}>
                <label style={s.label}>発表カテゴリ <span style={s.required}>必須</span></label>
                <div style={s.chips}>
                  {CATEGORIES[p].map(opt => (
                    <button key={opt} onClick={() => set("category", opt)}
                      style={{ ...s.chip, ...(form.category === opt ? s.chipOn : {}) }}>{opt}</button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <label style={s.label}>診療科・領域 <span style={s.required}>必須</span></label>
                <div style={s.chips}>
                  {FIELDS[p].map(opt => (
                    <button key={opt} onClick={() => set("field", opt)}
                      style={{ ...s.chip, ...(form.field === opt ? s.chipOn : {}) }}>{opt}</button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <label style={s.label}>疾患・障害名 <span style={s.required}>必須</span></label>
                <input value={form.disease || ""} onChange={e => set("disease", e.target.value)}
                  placeholder={ph.disease} style={s.input} />
              </div>

              <div style={s.section}>
                <label style={s.label}>性別</label>
                <div style={s.chips}>
                  {GENDERS.map(opt => (
                    <button key={opt} onClick={() => set("gender", opt)}
                      style={{ ...s.chip, ...(form.gender === opt ? s.chipOn : {}) }}>{opt}</button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <label style={s.label}>年齢層</label>
                <div style={s.chips}>
                  {AGE_GROUPS.map(opt => (
                    <button key={opt} onClick={() => set("age", opt)}
                      style={{ ...s.chip, ...(form.age === opt ? s.chipOn : {}) }}>{opt}</button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <label style={s.label}>タイトルのイメージ <span style={s.required}>必須</span></label>
                <input value={form.title || ""} onChange={e => set("title", e.target.value)}
                  placeholder={ph.title} style={s.input} />
              </div>

              <div style={s.section}>
                <label style={s.label}>背景・動機・気づき <span style={s.required}>必須</span></label>
                <p style={s.hint}>なぜこの事例を発表しようと思いましたか？</p>
                <textarea value={form.background || ""} onChange={e => set("background", e.target.value)}
                  placeholder={ph.background} rows={5} style={s.textarea} />
              </div>

              <div style={s.section}>
                <label style={s.label}>介入・取り組みの内容 <span style={s.required}>必須</span></label>
                <p style={s.hint}>何を・誰に・何回・どのように行ったか具体的に</p>
                <textarea value={form.intervention || ""} onChange={e => set("intervention", e.target.value)}
                  placeholder={ph.intervention} rows={5} style={s.textarea} />
              </div>

              <div style={s.section}>
                <label style={s.label}>結果・成果 <span style={s.required}>必須</span></label>
                <p style={s.hint}>数値・患者の言葉・観察事実を具体的に</p>
                <textarea value={form.result || ""} onChange={e => set("result", e.target.value)}
                  placeholder={ph.result} rows={5} style={s.textarea} />
              </div>

              <div style={s.section}>
                <label style={s.label}>数値・期間の補足</label>
                <p style={s.hint}>入院期間・訓練回数・観察期間・評価指標など</p>
                <textarea value={form.numbers || ""} onChange={e => set("numbers", e.target.value)}
                  placeholder={ph.numbers} rows={3} style={s.textarea} />
              </div>

              <div style={s.section}>
                <label style={s.label}>なぜうまくいったと思いますか？</label>
                <p style={s.hint}>直感・主観でOKです。考察の核になります</p>
                <textarea value={form.uniqueness || ""} onChange={e => set("uniqueness", e.target.value)}
                  placeholder={ph.uniqueness} rows={3} style={s.textarea} />
              </div>

              <div style={s.section}>
                <label style={s.label}>他と違うと感じた点は何ですか？</label>
                <p style={s.hint}>小さなことでもOKです</p>
                <textarea value={form.difference || ""} onChange={e => set("difference", e.target.value)}
                  placeholder={ph.difference} rows={3} style={s.textarea} />
              </div>

              <div style={s.section}>
                <label style={s.label}>抄録の字数制限 <span style={s.required}>必須</span></label>
                <div style={s.chips}>
                  {WORD_LIMITS.map(opt => (
                    <button key={opt} onClick={() => set("wordLimit", opt)}
                      style={{ ...s.chip, ...(form.wordLimit === opt ? s.chipOn : {}) }}>{opt}</button>
                  ))}
                </div>
              </div>

              <button onClick={goToConfirm} style={s.btnPrimary}>内容を確認する →</button>
            </>}

            {!p && <p style={{ color: "#64748b", fontSize: 14, textAlign: "center", marginTop: 20 }}>まず職種を選択してください</p>}
          </div>
        )}

        {/* PAGE 2 */}
        {page === 2 && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>内容を確認・修正してください</h2>

            {issues.length > 0 && (
              <div style={s.issuesBanner}>
                <p style={s.issuesBannerTitle}>⚠️ {issues.length}件の不足・改善点があります</p>
                <p style={s.issuesBannerSub}>赤枠の項目を修正してから生成してください（スキップも可能です）</p>
                <div style={{ marginTop: 10 }}>
                  {issues.map((issue, i) => <p key={i} style={s.issueItem}>• {issue.msg}</p>)}
                </div>
              </div>
            )}

            {issues.length === 0 && (
              <div style={s.okBanner}>
                <p style={s.okBannerText}>✅ 情報は十分です！このまま生成できます。</p>
              </div>
            )}

            <div style={fieldStyle("prof")}>
              <label style={s.label}>職種</label>
              <div style={s.profGrid}>
                {PROFESSIONS.map(pr => (
                  <button key={pr.id} onClick={() => set("prof", pr.id)}
                    style={{ ...s.profCard, ...(form.prof === pr.id ? s.profCardOn : {}) }}>
                    <span style={s.profIcon}>{pr.icon}</span>
                    <span style={s.profLabel}>{pr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={fieldStyle("category")}>
              <label style={s.label}>発表カテゴリ</label>
              <div style={s.chips}>
                {CATEGORIES[p || "nurse"].map(opt => (
                  <button key={opt} onClick={() => set("category", opt)}
                    style={{ ...s.chip, ...(form.category === opt ? s.chipOn : {}) }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={fieldStyle("field")}>
              <label style={s.label}>診療科・領域</label>
              <div style={s.chips}>
                {FIELDS[p || "nurse"].map(opt => (
                  <button key={opt} onClick={() => set("field", opt)}
                    style={{ ...s.chip, ...(form.field === opt ? s.chipOn : {}) }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={fieldStyle("disease")}>
              <label style={s.label}>疾患・障害名</label>
              <input value={form.disease || ""} onChange={e => set("disease", e.target.value)}
                placeholder={ph.disease} style={s.input} />
            </div>

            <div style={fieldStyle("gender")}>
              <label style={s.label}>性別</label>
              <div style={s.chips}>
                {GENDERS.map(opt => (
                  <button key={opt} onClick={() => set("gender", opt)}
                    style={{ ...s.chip, ...(form.gender === opt ? s.chipOn : {}) }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={fieldStyle("age")}>
              <label style={s.label}>年齢層</label>
              <div style={s.chips}>
                {AGE_GROUPS.map(opt => (
                  <button key={opt} onClick={() => set("age", opt)}
                    style={{ ...s.chip, ...(form.age === opt ? s.chipOn : {}) }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={fieldStyle("title")}>
              <label style={s.label}>タイトルのイメージ</label>
              <input value={form.title || ""} onChange={e => set("title", e.target.value)}
                placeholder={ph.title} style={s.input} />
            </div>

            <div style={fieldStyle("background")}>
              <label style={s.label}>背景・動機・気づき</label>
              <textarea value={form.background || ""} onChange={e => set("background", e.target.value)} rows={5} style={s.textarea} />
            </div>

            <div style={fieldStyle("intervention")}>
              <label style={s.label}>介入・取り組みの内容</label>
              <textarea value={form.intervention || ""} onChange={e => set("intervention", e.target.value)} rows={5} style={s.textarea} />
            </div>

            <div style={fieldStyle("result")}>
              <label style={s.label}>結果・成果</label>
              <textarea value={form.result || ""} onChange={e => set("result", e.target.value)} rows={5} style={s.textarea} />
            </div>

            <div style={s.fieldBox}>
              <label style={s.label}>数値・期間の補足</label>
              <textarea value={form.numbers || ""} onChange={e => set("numbers", e.target.value)} rows={3} style={s.textarea} />
            </div>

            <div style={s.fieldBox}>
              <label style={s.label}>なぜうまくいったか</label>
              <textarea value={form.uniqueness || ""} onChange={e => set("uniqueness", e.target.value)} rows={3} style={s.textarea} />
            </div>

            <div style={s.fieldBox}>
              <label style={s.label}>他と違うと感じた点</label>
              <textarea value={form.difference || ""} onChange={e => set("difference", e.target.value)} rows={3} style={s.textarea} />
            </div>

            <div style={fieldStyle("wordLimit")}>
              <label style={s.label}>字数制限</label>
              <div style={s.chips}>
                {WORD_LIMITS.map(opt => (
                  <button key={opt} onClick={() => set("wordLimit", opt)}
                    style={{ ...s.chip, ...(form.wordLimit === opt ? s.chipOn : {}) }}>{opt}</button>
                ))}
              </div>
            </div>

            {error && <p style={s.errorMsg}>{error}</p>}

            <div style={s.navRow}>
              <button onClick={() => { setPage(1); window.scrollTo(0, 0); }} style={s.btnBack}>← 入力に戻る</button>
              <button onClick={generate} disabled={loading}
                style={{ ...s.btnPrimary, ...(loading ? s.btnOff : {}) }}>
                {loading ? "ただいま作成中..." : "抄録を生成する ✦"}
              </button>
            </div>
          </div>
        )}

        {/* PAGE 3 */}
        {page === 3 && output && (
          <div style={s.card}>
            <div style={s.doneTop}>
              <div>
                <h2 style={s.doneTitle}>抄録が完成しました！</h2>
                <p style={s.doneSub}>【　】に自分の数値を入れて完成させてください</p>
              </div>
              <div style={s.doneActs}>
                <button onClick={copy} style={s.btnCopy}>{copied ? "✓ コピー完了" : "📋 全文コピー"}</button>
                <button onClick={reset} style={s.btnReset}>最初から</button>
              </div>
            </div>
            <div style={s.summary}>
              {[["職種", PROF_LABEL[form.prof]], ["カテゴリ", form.category], ["診療科", form.field], ["疾患", form.disease], ["字数", form.wordLimit]]
                .filter(([, v]) => v).map(([k, v]) => <span key={k} style={s.tag}>{k}：{v}</span>)}
            </div>
            <textarea id="output-ta" readOnly value={output} rows={24}
              style={s.outputTa}
              onClick={e => { e.target.select(); e.target.setSelectionRange(0, 99999); }} />
            <div style={s.tip}>
              <p style={s.tipTitle}>💡 さらに精度を上げるには</p>
              <p style={s.tipText}>この内容をClaude.aiに貼り付けて「考察をもっと詳しく」「字数を確認して」と追加依頼すると仕上がりが上がります</p>
            </div>
          </div>
        )}

        <footer style={s.footer}>医療職向け 学会抄録サポートツール ｜ MediWork AI</footer>
      </div>
    </div>
  );
}

const s = {
  root:       { minHeight: "100vh", background: "#080d1a", fontFamily: "'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", position: "relative", overflowX: "hidden" },
  bgGrid:     { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(6,182,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  wrap:       { position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" },
  header:     { textAlign: "center", marginBottom: 32 },
  badge:      { display: "inline-block", background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 14px", borderRadius: 20, marginBottom: 14 },
  title:      { fontSize: 26, fontWeight: 900, color: "#f0f9ff", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.3 },
  sub:        { fontSize: 13, color: "#94a3b8", margin: "0 0 24px" },
  steps:      { display: "flex", alignItems: "center", justifyContent: "center", gap: 0 },
  stepItem:   { display: "flex", alignItems: "center", gap: 6 },
  stepCircle: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 },
  stepActive: { background: "#06b6d4", color: "#fff" },
  stepDone:   { background: "#0e7490", color: "#fff" },
  stepInactive: { background: "#1e293b", color: "#475569", border: "1px solid #334155" },
  stepLabel:  { fontSize: 11, color: "#64748b", marginRight: 4 },
  stepLine:   { width: 32, height: 2, background: "#1e293b", margin: "0 4px" },
  stepLineDone: { background: "#0e7490" },
  card:       { background: "rgba(15,23,42,0.97)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 18, padding: "32px 28px", boxShadow: "0 4px 40px rgba(6,182,212,0.06)" },
  cardTitle:  { fontSize: 18, fontWeight: 800, color: "#f0f9ff", margin: "0 0 8px" },
  cardSub:    { fontSize: 13, color: "#64748b", margin: "0 0 28px", lineHeight: 1.7 },
  section:    { marginBottom: 24 },
  fieldBox:   { marginBottom: 20, padding: "16px", background: "#0a1628", borderRadius: 12, border: "1px solid #1e293b" },
  fieldBoxError: { borderColor: "#ef4444", background: "rgba(239,68,68,0.05)" },
  label:      { display: "block", fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginBottom: 10 },
  required:   { color: "#06b6d4", fontSize: 11, marginLeft: 4 },
  hint:       { fontSize: 12, color: "#64748b", margin: "-6px 0 10px", lineHeight: 1.7, borderLeft: "3px solid #06b6d4", paddingLeft: 10 },
  profGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  profCard:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px", background: "#0f172a", border: "1px solid #334155", borderRadius: 12, cursor: "pointer" },
  profCardOn: { background: "rgba(6,182,212,0.12)", borderColor: "#06b6d4" },
  profIcon:   { fontSize: 28 },
  profLabel:  { fontSize: 13, fontWeight: 700, color: "#e2e8f0" },
  chips:      { display: "flex", flexWrap: "wrap", gap: 8 },
  chip:       { padding: "7px 14px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", fontSize: 13, cursor: "pointer" },
  chipOn:     { background: "rgba(6,182,212,0.15)", borderColor: "#06b6d4", color: "#06b6d4", fontWeight: 700 },
  input:      { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0", fontSize: 14, padding: "11px 14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  textarea:   { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0", fontSize: 14, padding: "11px 14px", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.7, boxSizing: "border-box" },
  btnPrimary: { display: "block", width: "100%", marginTop: 28, padding: "14px", background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: "0.03em" },
  btnOff:     { background: "#1e293b", color: "#475569", cursor: "not-allowed" },
  navRow:     { display: "flex", gap: 12, marginTop: 28 },
  btnBack:    { flex: "0 0 120px", padding: "14px", background: "#1e293b", color: "#94a3b8", fontWeight: 600, fontSize: 14, border: "1px solid #334155", borderRadius: 10, cursor: "pointer" },
  issuesBanner: { background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 },
  issuesBannerTitle: { color: "#fbbf24", fontWeight: 700, fontSize: 14, margin: "0 0 4px" },
  issuesBannerSub: { color: "#94a3b8", fontSize: 13, margin: 0 },
  issueItem:  { color: "#fbbf24", fontSize: 13, margin: "4px 0" },
  okBanner:   { background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 24 },
  okBannerText: { color: "#34d399", fontWeight: 700, fontSize: 14, margin: 0 },
  errorMsg:   { color: "#f87171", fontSize: 13, margin: "0 0 12px" },
  doneTop:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  doneTitle:  { fontSize: 18, fontWeight: 900, color: "#06b6d4", margin: "0 0 4px" },
  doneSub:    { fontSize: 13, color: "#64748b", margin: 0 },
  doneActs:   { display: "flex", gap: 8 },
  btnCopy:    { padding: "9px 18px", background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 8, cursor: "pointer" },
  btnReset:   { padding: "9px 16px", background: "#1e293b", color: "#94a3b8", fontWeight: 600, fontSize: 13, border: "1px solid #334155", borderRadius: 8, cursor: "pointer" },
  summary:    { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  tag:        { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#06b6d4", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 },
  outputTa:   { width: "100%", background: "#050a14", border: "1px solid #1e293b", borderRadius: 12, padding: "16px", color: "#e2e8f0", fontSize: 14, lineHeight: 1.9, fontFamily: "'Noto Sans JP',sans-serif", boxSizing: "border-box", resize: "vertical", outline: "none", marginBottom: 16, cursor: "text" },
  tip:        { background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: 10, padding: "12px 16px" },
  tipTitle:   { color: "#06b6d4", fontSize: 13, fontWeight: 700, margin: "0 0 4px" },
  tipText:    { color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.7 },
  footer:     { textAlign: "center", marginTop: 40, color: "#1e293b", fontSize: 12 },
};
