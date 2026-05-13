"use client";

import { useState } from "react";

// ─────────────────────────────────────────────
// 定数・選択肢
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 職種別：質問・プレースホルダー・良い例
// ─────────────────────────────────────────────
const Q_DISEASE = {
  nurse: { label: "主な疾患・病名を教えてください", sub: "個人が特定されない範囲で記載してください", placeholder: "例：急性心不全、大腿骨頸部骨折" },
  pt:    { label: "主な疾患・障害名を教えてください", sub: "個人が特定されない範囲で記載してください", placeholder: "例：脳梗塞（左片麻痺）、変形性膝関節症" },
  ot:    { label: "主な疾患・障害名を教えてください", sub: "高次脳機能障害がある場合は併記してください", placeholder: "例：脳出血（右片麻痺・失語）、認知症" },
  st:    { label: "主な疾患・障害名を教えてください", sub: "嚥下・言語の障害名も記載してください", placeholder: "例：脳梗塞後遺症（嚥下障害・失語症）" },
};

const Q_TITLE = {
  nurse: { label: "タイトルのイメージを教えてください", sub: "キーワードや伝えたいことをそのまま書いてください", placeholder: "例：退院指導の工夫、せん妄予防への関わり" },
  pt:    { label: "タイトルのイメージを教えてください", sub: "改善した機能・評価指標・アプローチ名など", placeholder: "例：歩行能力改善、バランス訓練、早期離床" },
  ot:    { label: "タイトルのイメージを教えてください", sub: "改善したADL・高次脳機能・作業など", placeholder: "例：食事動作の自立、復職支援、認知症への作業療法" },
  st:    { label: "タイトルのイメージを教えてください", sub: "改善した機能・訓練名・評価指標など", placeholder: "例：嚥下機能改善、失語症への介入、VF検査後の訓練" },
};

const Q_BACKGROUND = {
  nurse: {
    label: "なぜこの事例を発表しようと思いましたか？",
    sub: "臨床上の問題・気づき・困ったことを書いてください",
    placeholder: "例：退院指導をしても再入院を繰り返す患者がいた。指導内容や方法に問題があると感じた。",
    goodExample: "💡 良い例：同疾患の再入院が〇ヶ月で〇件続いた。従来の口頭説明だけでは理解が定着しないと感じ、指導方法を見直す必要があると考えた。",
  },
  pt: {
    label: "なぜこの症例を発表しようと思いましたか？",
    sub: "臨床上の問題・気づき・難渋した点を書いてください",
    placeholder: "例：標準的なアプローチでは歩行改善が得られず、原因を再評価する必要があった。",
    goodExample: "💡 良い例：入院〇日経過しても歩行能力が改善せず、評価を再検討した結果〇〇が原因と判明した。",
  },
  ot: {
    label: "なぜこの症例を発表しようと思いましたか？",
    sub: "ADL・高次脳機能・復職など、問題意識を書いてください",
    placeholder: "例：高次脳機能障害により食事動作が自立しなかった。従来の反復練習では効果が得られなかった。",
    goodExample: "💡 良い例：〇〇障害により食事動作が自立困難で、入院〇週時点でFIM〇点と改善が乏しかった。",
  },
  st: {
    label: "なぜこの症例を発表しようと思いましたか？",
    sub: "嚥下・言語・認知機能など、問題意識を書いてください",
    placeholder: "例：誤嚥リスクが高く経口摂取が困難だった。VF検査で〇〇が確認され、訓練方法を検討した。",
    goodExample: "💡 良い例：入院時より誤嚥性肺炎を反復し、VF検査で咽頭残留を認めた。経口摂取再開に向けた訓練選択が課題となった。",
  },
};

const Q_INTERVENTION = {
  nurse: {
    label: "どんな看護介入・取り組みをしましたか？",
    sub: "何を・誰に・何回・どのように行ったか具体的に",
    placeholder: "例：本人・妻にパンフレットを用いて計4回指導し、毎回理解度を口頭確認した。",
    goodExample: "💡 良い例：退院3日前より本人・妻にパンフレットを使用し、体重測定・塩分制限・症状悪化時の対応を計4回指導。毎回5段階で理解度を評価し、次回目標を設定した。",
  },
  pt: {
    label: "どんなリハビリ介入・アプローチをしましたか？",
    sub: "訓練内容・頻度・期間・評価指標を具体的に",
    placeholder: "例：バランス訓練を1日2回・計20回実施。BBS・TUGで経過評価した。",
    goodExample: "💡 良い例：〇〇訓練を週〇回・計〇回実施（期間：〇週間）。評価はBBS・10m歩行を介入前後で比較した。",
  },
  ot: {
    label: "どんな作業療法介入をしましたか？",
    sub: "訓練内容・使用した評価・環境調整・頻度を具体的に",
    placeholder: "例：食事動作訓練を1日1回・計15回実施。FIM・MAMSで評価した。",
    goodExample: "💡 良い例：〇〇を用いた食事動作訓練を週〇回実施。環境調整（自助具・食器配置）を加え、FIMの食事項目で経過評価した。",
  },
  st: {
    label: "どんな言語聴覚療法介入をしましたか？",
    sub: "訓練内容・評価指標・VF/VE実施の有無・頻度を具体的に",
    placeholder: "例：間接訓練（口腔ケア・嚥下体操）を1日2回、直接訓練をトロミ食から開始した。",
    goodExample: "💡 良い例：間接訓練を1日2回、直接訓練（トロミ食→軟食）を週〇回実施。FILS・EATINGで経過評価し、〇週後にVF再検した。",
  },
};

const Q_RESULT = {
  nurse: {
    label: "介入の結果、どんな変化・成果がありましたか？",
    sub: "数値・患者の言葉・観察事実を具体的に。期間も入れると良い",
    placeholder: "例：退院3ヶ月後の外来受診時に再入院なし。体重管理が自己でできていた。",
    goodExample: "💡 良い例：退院後〇ヶ月間再入院なし。外来時に体重記録表を持参し、〇kgの変動幅で自己管理できていた。患者から「体重の見方がわかった」と発言あり。",
  },
  pt: {
    label: "介入の結果、どんな変化・改善がみられましたか？",
    sub: "評価指標の数値（介入前→後）を必ず入れてください",
    placeholder: "例：BBS 32→48点、TUG 18→11秒に改善。病棟内歩行が自立した。",
    goodExample: "💡 良い例：BBS〇→〇点、10m歩行〇→〇秒、TUG〇→〇秒に改善。〇週後に病棟内歩行自立・退院となった。",
  },
  ot: {
    label: "介入の結果、どんな変化・改善がみられましたか？",
    sub: "FIMなどの評価点数（介入前→後）を必ず入れてください",
    placeholder: "例：FIM食事項目 3→6点に改善。スプーン操作が自立した。",
    goodExample: "💡 良い例：FIM合計〇→〇点（食事〇→〇点）に改善。〇週後に食事動作自立し、退院時にFIM〇点となった。",
  },
  st: {
    label: "介入の結果、どんな変化・改善がみられましたか？",
    sub: "評価指標（FILS・EATING等）の数値と食形態の変化を入れてください",
    placeholder: "例：FILS Lv.3→6に改善。トロミ食から全粥食へ移行できた。",
    goodExample: "💡 良い例：FILS〇→〇、EATING〇→〇点に改善。〇週後にトロミ食→全粥食へ移行し、誤嚥性肺炎の再発なく退院となった。",
  },
};

const Q_NUMBERS = {
  nurse: { label: "数値・期間を補足してください", sub: "入院期間・指導回数・観察期間など", placeholder: "例：入院期間14日、退院後3ヶ月観察、指導4回実施" },
  pt:    { label: "数値・期間を補足してください", sub: "入院期間・訓練回数・観察期間・使用した評価指標など", placeholder: "例：入院60日、訓練週5回×8週、BBS/TUG/10m歩行で評価" },
  ot:    { label: "数値・期間を補足してください", sub: "入院期間・訓練回数・使用した評価指標など", placeholder: "例：入院45日、訓練週5回×6週、FIM/MAMSで評価" },
  st:    { label: "数値・期間を補足してください", sub: "入院期間・訓練回数・VF/VE実施の有無・使用した評価指標など", placeholder: "例：入院30日、訓練週5回×4週、VF2回実施、FILS/EATINGで評価" },
};

// ─────────────────────────────────────────────
// 質問リスト生成（職種依存）
// ─────────────────────────────────────────────
const buildQuestions = (prof) => [
  { id: "category",     type: "chip",     label: "発表カテゴリを選んでください",      sub: "発表の種類を選択してください",           options: CATEGORIES[prof] },
  { id: "field",        type: "chip",     label: "診療科・領域を選んでください",        sub: "担当した科・領域を選択してください",     options: FIELDS[prof] },
  { id: "disease",      type: "text",     ...Q_DISEASE[prof] },
  { id: "gender",       type: "chip",     label: "患者さんの性別を選んでください",      sub: "「記載なし」も選択できます",             options: GENDERS },
  { id: "age",          type: "chip",     label: "患者さんの年齢層を選んでください",    sub: "おおよその年代で構いません",             options: AGE_GROUPS },
  { id: "title",        type: "text",     ...Q_TITLE[prof] },
  { id: "background",   type: "textarea", ...Q_BACKGROUND[prof] },
  { id: "intervention", type: "textarea", ...Q_INTERVENTION[prof] },
  { id: "result",       type: "textarea", ...Q_RESULT[prof] },
  { id: "numbers",      type: "textarea", ...Q_NUMBERS[prof] },
  { id: "uniqueness",   type: "textarea", label: "なぜうまくいったと思いますか？",        sub: "あなた自身の解釈で教えてください。正解はありません。直感でもOKです",  placeholder: "例：家族を巻き込んだことで患者の動機が上がったと思う。いつもは本人だけに指導していたが、今回は違った。" },
  { id: "difference",   type: "textarea", label: "この事例で他と違うと感じた点は何ですか？", sub: "小さなことでも構いません。「いつもと違う」と感じたことを書いてください", placeholder: "例：患者が自分から質問してきた。退院後も外来で報告してくれた。家族の協力が今まで以上に得られた。" },
  { id: "wordLimit",    type: "chip",     label: "抄録の字数制限を選んでください",      sub: "提出先の規定に合わせてください",         options: WORD_LIMITS },
];

// ─────────────────────────────────────────────
// 不足チェック（生成前）
// ─────────────────────────────────────────────
const checkInsufficiency = (form) => {
  const issues = [];
  const hasNumber = (str) => /[0-9０-９]/.test(str || "");

  if ((form.background || "").length < 30)
    issues.push({ field: "background", msg: "背景・動機がやや短いです。「なぜ問題と感じたか」を1文追加してください。" });
  if ((form.intervention || "").length < 30)
    issues.push({ field: "intervention", msg: "介入内容がやや短いです。「何を・何回・どのように」をもう少し具体的に書いてください。" });
  if (!hasNumber(form.result))
    issues.push({ field: "result", msg: "結果に数値がありません。評価点数・期間・回数など1つでも数値を入れると抄録の質が上がります。" });
  if (!hasNumber(form.numbers) && !hasNumber(form.intervention) && !hasNumber(form.result))
    issues.push({ field: "numbers", msg: "入院期間・訓練回数・観察期間など具体的な数値が見当たりません。補足欄に追記してください。" });

  return issues;
};

// ─────────────────────────────────────────────
// プロンプト生成
// ─────────────────────────────────────────────
const PROF_LABEL = { nurse: "看護師", pt: "理学療法士", ot: "作業療法士", st: "言語聴覚士" };

const buildPrompt = (form, prof) => {
  const patientParts = [
    form.disease,
    form.gender !== "記載なし" ? form.gender : null,
    form.age    !== "記載なし" ? form.age    : null,
  ].filter(Boolean);
  const patientInfo = patientParts.length ? patientParts.join("・") : "記載なし";

  return `あなたは${PROF_LABEL[prof]}の学会発表・抄録作成を専門とするアドバイザーです。
以下の情報をもとに、学会抄録を作成してください。

■ 発表者情報
職種：${PROF_LABEL[prof]}
カテゴリ：${form.category}
診療科・領域：${form.field}
患者情報：${patientInfo}
タイトルイメージ：${form.title}
字数制限：${form.wordLimit}

■ 発表内容
【背景・動機】
${form.background}

【介入・取り組み内容】
${form.intervention}

【結果・成果】
${form.result}

【なぜうまくいったか（本人の解釈）】
${form.uniqueness}

【他と違うと感じた点】
${form.difference}

【数値・期間の補足】
${form.numbers || "記載なし"}

■ 出力形式（必ずこの順番で出力してください）

【タイトル案（3案）】
1.
2.
3.

【抄録本文】
以下のルールを厳守してください：
- 字数制限「${form.wordLimit}」に厳密に収めること（超過禁止）
- 構成：はじめに → 事例紹介 → 結果 → 考察・まとめ
- 入力にない数値・事実は絶対に補完・創作しないこと
- 情報が不足している箇所は【情報不足：〇〇を追記してください】と明示すること
- 患者個人が特定されない表現を使うこと
- ${PROF_LABEL[prof]}として学会に提出できるレベルの文章にすること
- 文体は「〜した。〜である。」調（体言止め可）
- 入力された「なぜうまくいったか」の解釈を考察の中心に据えること
- 一般論・教科書的な考察は最小限にすること
- 「この事例ならでは」の視点を考察に1文以上入れること
- タイトル案は新規性・独自性が伝わる表現にすること
- 他の発表と差別化できる切り口を意識すること

■ 補完ルール（厳守）
- 領域・疾患に応じて一般的に使われる評価指標・用語を適切に補完して抄録を作成すること
- 入力に具体的な数値の記載がない項目は創作せず【　】（白括弧）で空白にすること
- 例）BNP【　】pg/mL、入院期間【　】日、FIM【　】点、10m歩行【　】秒、HbA1c【　】%
- 【　】が残った状態で出力し、使用者が自分の数値を埋めて完成させる前提で作ること
- 補完した用語・評価指標が実際の臨床で使われる標準的なものであることを確認すること
`;
};

// ─────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────
export default function App() {
  const [prof,     setProf]     = useState("");      // 職種
  const [qIndex,   setQIndex]   = useState(-1);      // -1=職種選択, 0〜=質問
  const [form,     setForm]     = useState({});
  const [current,  setCurrent]  = useState("");
  const [issues,   setIssues]   = useState([]);      // 不足チェック結果
  const [checking, setChecking] = useState(false);   // 不足チェック画面
  const [prompt,   setPrompt]   = useState("");
  const [copied,   setCopied]   = useState(false);

  const questions = prof ? buildQuestions(prof) : [];
  const q         = questions[qIndex];
  const isDone    = qIndex === questions.length && !checking;
  const progress  = qIndex >= 0 ? Math.round((qIndex / questions.length) * 100) : 0;

  // 職種選択
  const selectProf = (p) => { setProf(p); setQIndex(0); setForm({}); setCurrent(""); };

  // chip選択
  const handleChip = (val) => setForm((f) => ({ ...f, [q.id]: val }));

  // テキスト入力の現在値
  const inputVal = q?.type !== "chip"
    ? (current !== "" ? current : (form[q?.id] ?? ""))
    : "";

  const canNext = () => {
    if (!q) return false;
    if (q.type === "chip") return !!form[q.id];
    return (current.trim() || form[q?.id] || "").trim().length > 0;
  };

  const goNext = () => {
    const val     = q.type === "chip" ? form[q.id] : (current.trim() || form[q.id] || "");
    const updated = { ...form, [q.id]: val };
    setForm(updated);
    setCurrent("");

    if (qIndex === questions.length - 1) {
      // 不足チェックへ
      const found = checkInsufficiency(updated);
      setIssues(found);
      setChecking(true);
      setQIndex(questions.length);
    } else {
      const nq = questions[qIndex + 1];
      if (nq?.type !== "chip" && updated[nq?.id]) setCurrent(updated[nq.id]);
      setQIndex((i) => i + 1);
    }
  };

  const goBack = () => {
    if (checking) { setChecking(false); setQIndex(questions.length - 1); return; }
    if (qIndex === 0) { setQIndex(-1); setProf(""); return; }
    const pq = questions[qIndex - 1];
    setQIndex((i) => i - 1);
    if (pq?.type !== "chip") setCurrent(form[pq.id] ?? "");
    else setCurrent("");
  };

  const generatePrompt = () => {
    setPrompt(buildPrompt(form, prof));
    setChecking(false);
  };

  const copy = () => {
    const el = document.getElementById("prompt-textarea");
    if (!el) return;
    el.select();
    el.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const reset = () => {
    setProf(""); setQIndex(-1); setForm({});
    setCurrent(""); setIssues([]); setChecking(false);
    setPrompt(""); setCopied(false);
  };

  // ─── 不足情報チェック画面で修正 ───
  const fixIssue = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <div style={s.root}>
      <div style={s.bgGrid} />
      <div style={s.wrap}>

        {/* ヘッダー */}
        <header style={s.header}>
          <div style={s.badge}>医療職専用</div>
          <h1 style={s.title}>学会抄録 作成ツール</h1>
          <p style={s.sub}>質問に答えるだけで、抄録・タイトル案を自動生成</p>
        </header>

        {/* 職種選択 */}
        {qIndex === -1 && (
          <div style={s.card}>
            <p style={s.qLabel}>あなたの職種を選んでください</p>
            <p style={s.qSub}>職種に合わせた質問・例文・プロンプトが生成されます</p>
            <div style={s.profGrid}>
              {PROFESSIONS.map((p) => (
                <button key={p.id} onClick={() => selectProf(p.id)}
                  style={{ ...s.profCard, ...(prof === p.id ? s.profCardOn : {}) }}>
                  <span style={s.profIcon}>{p.icon}</span>
                  <span style={s.profLabel}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 質問カード */}
        {qIndex >= 0 && !checking && !isDone && q && (
          <div style={s.card}>
            <div style={s.progRow}>
              <div style={s.progBar}><div style={{ ...s.progFill, width: `${progress}%` }} /></div>
              <span style={s.progNum}>{qIndex + 1} / {questions.length}</span>
            </div>

            <p style={s.qLabel}>{q.label}</p>
            {q.sub && <p style={s.qSub}>{q.sub}</p>}

            {/* 良い例 */}
            {q.goodExample && (
              <div style={s.goodEx}>{q.goodExample}</div>
            )}

            {q.type === "chip" && (
              <div style={s.chips}>
                {q.options.map((opt) => (
                  <button key={opt} onClick={() => handleChip(opt)}
                    style={{ ...s.chip, ...(form[q.id] === opt ? s.chipOn : {}) }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "text" && (
              <input value={inputVal} onChange={(e) => setCurrent(e.target.value)}
                placeholder={q.placeholder} style={s.input} />
            )}
            {q.type === "textarea" && (
              <textarea value={inputVal} onChange={(e) => setCurrent(e.target.value)}
                placeholder={q.placeholder} rows={4} style={s.textarea} />
            )}

            <div style={s.nav}>
              <button onClick={goBack} style={s.btnBack}>← 戻る</button>
              <button onClick={goNext} disabled={!canNext()}
                style={{ ...s.btnNext, ...(!canNext() ? s.btnOff : {}) }}>
                {qIndex === questions.length - 1 ? "内容を確認する →" : "次へ →"}
              </button>
            </div>
          </div>
        )}

        {/* 不足チェック画面 */}
        {checking && (
          <div style={s.card}>
            <h2 style={s.checkTitle}>
              {issues.length === 0 ? "✅ 情報は十分です！" : `⚠️ ${issues.length}件の補足をお願いします`}
            </h2>
            <p style={s.checkSub}>
              {issues.length === 0
                ? "このまま生成に進んでください。抄録の品質を高める情報が揃っています。"
                : "以下の項目を補足すると、抄録の精度が大きく上がります。スキップも可能です。"}
            </p>

            {issues.map((issue) => (
              <div key={issue.field} style={s.issueBox}>
                <p style={s.issueMsg}>⚠️ {issue.msg}</p>
                <textarea
                  value={form[issue.field] || ""}
                  onChange={(e) => fixIssue(issue.field, e.target.value)}
                  rows={3}
                  style={s.textarea}
                  placeholder="ここに追記してください"
                />
              </div>
            ))}

            <div style={s.nav}>
              <button onClick={goBack} style={s.btnBack}>← 戻る</button>
              <button onClick={generatePrompt} style={s.btnNext}>
                プロンプトを生成する ✦
              </button>
            </div>
          </div>
        )}

        {/* 完了画面 */}
        {isDone && prompt && (
          <div style={s.card}>
            <div style={s.doneTop}>
              <div>
                <h2 style={s.doneTitle}>プロンプト完成！</h2>
                <p style={s.doneSub}>コピーして Claude.ai に貼り付けてください</p>
              </div>
              <div style={s.doneActs}>
                <button onClick={copy} style={s.btnCopy}>{copied ? "✓ コピー完了" : "📋 全文コピー"}</button>
                <button onClick={reset} style={s.btnReset}>最初から</button>
              </div>
            </div>

            {/* サマリータグ */}
            <div style={s.summary}>
              {[
                ["職種", PROF_LABEL[prof]],
                ["カテゴリ", form.category],
                ["診療科", form.field],
                ["疾患", form.disease],
                ["性別", form.gender !== "記載なし" ? form.gender : null],
                ["年齢", form.age !== "記載なし" ? form.age : null],
                ["字数", form.wordLimit],
              ].filter(([, v]) => v).map(([k, v]) => (
                <span key={k} style={s.tag}>{k}：{v}</span>
              ))}
            </div>

            {/* 使い方ガイド */}
            <div style={s.guide}>
              <p style={s.guideTitle}>📌 このあとの手順</p>
              {[
                "「全文コピー」ボタン、またはテキストエリアをタップして全選択→コピー",
                "claude.ai を開いて新しいチャットに貼り付けて送信",
                "抄録・タイトル3案が完成！",
              ].map((t, i) => (
                <div key={i} style={s.guideRow}>
                  <span style={s.guideNum}>{i + 1}</span>
                  <span style={s.guideText}>{t}</span>
                </div>
              ))}
            </div>

            {/* プロンプト本文 */}
            <div style={s.promptBox}>
              <textarea
                id="prompt-textarea"
                readOnly
                value={prompt}
                style={s.promptTextarea}
                onClick={(e) => { e.target.select(); e.target.setSelectionRange(0, 99999); }}
              />
            </div>
            <p style={s.copyHint}>⬆️ テキストエリアをタップして全選択 → コピー（Ctrl+C / ⌘+C）</p>

            <div style={s.tip}>
              <p style={s.tipTitle}>💡 さらに精度を上げるには</p>
              <p style={s.tipText}>抄録が生成されたら「もう少し簡潔にして」「考察を詳しく」「字数を確認して」と追加依頼すると仕上がりが上がります</p>
            </div>
          </div>
        )}

        <footer style={s.footer}>医療職向け 学会抄録サポートツール ｜ Powered by Claude AI</footer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// スタイル
// ─────────────────────────────────────────────
const s = {
  root:      { minHeight: "100vh", background: "#080d1a", fontFamily: "'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", position: "relative", overflowX: "hidden" },
  bgGrid:    { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(6,182,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  wrap:      { position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "40px 20px 80px" },
  header:    { textAlign: "center", marginBottom: 32 },
  badge:     { display: "inline-block", background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", padding: "4px 14px", borderRadius: 20, marginBottom: 14 },
  title:     { fontSize: 26, fontWeight: 900, color: "#f0f9ff", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.3 },
  sub:       { fontSize: 13, color: "#94a3b8", margin: 0 },
  card:      { background: "rgba(15,23,42,0.97)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 18, padding: "32px 28px", boxShadow: "0 4px 40px rgba(6,182,212,0.06)" },

  // 職種選択
  profGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 },
  profCard:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: 14, cursor: "pointer", transition: "all 0.15s" },
  profCardOn:{ background: "rgba(6,182,212,0.12)", borderColor: "#06b6d4" },
  profIcon:  { fontSize: 32 },
  profLabel: { fontSize: 14, fontWeight: 700, color: "#e2e8f0" },

  // プログレス
  progRow:   { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  progBar:   { flex: 1, height: 5, background: "#1e293b", borderRadius: 4, overflow: "hidden" },
  progFill:  { height: "100%", background: "linear-gradient(90deg,#06b6d4,#0891b2)", borderRadius: 4, transition: "width 0.35s ease" },
  progNum:   { fontSize: 12, color: "#64748b", whiteSpace: "nowrap" },

  // 質問
  qLabel:    { fontSize: 17, fontWeight: 800, color: "#f0f9ff", margin: "0 0 8px", lineHeight: 1.5 },
  qSub:      { fontSize: 12, color: "#64748b", margin: "0 0 16px", lineHeight: 1.7, background: "rgba(6,182,212,0.06)", padding: "8px 12px", borderRadius: 8, borderLeft: "3px solid #06b6d4" },
  goodEx:    { fontSize: 12, color: "#34d399", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, padding: "10px 14px", margin: "0 0 16px", lineHeight: 1.8, whiteSpace: "pre-wrap" },

  // 入力
  chips:     { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 },
  chip:      { padding: "8px 16px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", fontSize: 14, cursor: "pointer" },
  chipOn:    { background: "rgba(6,182,212,0.15)", borderColor: "#06b6d4", color: "#06b6d4", fontWeight: 700 },
  input:     { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0", fontSize: 15, padding: "12px 14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 28 },
  textarea:  { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0", fontSize: 14, padding: "12px 14px", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.7, boxSizing: "border-box", marginBottom: 8 },

  // ナビ
  nav:       { display: "flex", gap: 12, marginTop: 20 },
  btnBack:   { flex: "0 0 90px", padding: "13px", background: "#1e293b", color: "#94a3b8", fontWeight: 600, fontSize: 14, border: "1px solid #334155", borderRadius: 10, cursor: "pointer" },
  btnNext:   { flex: 1, padding: "13px", background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: "0.03em" },
  btnOff:    { background: "#1e293b", color: "#475569", cursor: "not-allowed" },

  // 不足チェック
  checkTitle:{ fontSize: 17, fontWeight: 800, color: "#f0f9ff", margin: "0 0 8px" },
  checkSub:  { fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.7 },
  issueBox:  { background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 12, padding: "16px", marginBottom: 16 },
  issueMsg:  { fontSize: 13, color: "#fbbf24", margin: "0 0 10px", lineHeight: 1.6 },

  // 完了
  doneTop:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  doneTitle: { fontSize: 18, fontWeight: 900, color: "#06b6d4", margin: "0 0 4px" },
  doneSub:   { fontSize: 13, color: "#64748b", margin: 0 },
  doneActs:  { display: "flex", gap: 8 },
  btnCopy:   { padding: "9px 18px", background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 8, cursor: "pointer" },
  btnReset:  { padding: "9px 16px", background: "#1e293b", color: "#94a3b8", fontWeight: 600, fontSize: 13, border: "1px solid #334155", borderRadius: 8, cursor: "pointer" },
  summary:   { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  tag:       { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#06b6d4", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 },
  guide:     { background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.18)", borderRadius: 12, padding: "16px 18px", marginBottom: 20 },
  guideTitle:{ color: "#06b6d4", fontSize: 13, fontWeight: 700, margin: "0 0 12px" },
  guideRow:  { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 },
  guideNum:  { width: 22, height: 22, borderRadius: "50%", background: "#06b6d4", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  guideText: { color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, paddingTop: 2 },
  promptBox: { background: "#050a14", border: "1px solid #1e293b", borderRadius: 12, padding: "20px", maxHeight: 400, overflowY: "auto", marginBottom: 16 },
  promptPre: { color: "#94a3b8", fontSize: 13, lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'Noto Sans JP',sans-serif" },
  tip:       { background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: 10, padding: "12px 16px" },
  tipTitle:  { color: "#06b6d4", fontSize: 13, fontWeight: 700, margin: "0 0 4px" },
  tipText:   { color: "#64748b", fontSize: 12, margin: 0, lineHeight: 1.7 },
  footer:    { textAlign: "center", marginTop: 40, color: "#1e293b", fontSize: 12 },
};
