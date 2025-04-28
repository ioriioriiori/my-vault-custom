// 修正版
module.exports = async (params) => {
  const { quickAddApi: qa, app } = params;
  const slug = await qa.inputPrompt("New project slug (e.g. alpha)");
  if (!slug) return;

  const fs = app.vault.adapter;
  const base = "03_project";
  const dir = `${base}/${slug}`;

  // フォルダ作成
  if (!await fs.exists(dir)) await fs.mkdir(dir);

  // rules.json を読む
  const rulePath = ".obsidian/plugins/auto-note-mover/rules.json";
  let rules = [];  // 初期は空
  if (await fs.exists(rulePath)) {
    try {
      const raw = await fs.read(rulePath);
      rules = JSON.parse(raw) || [];
      if (!Array.isArray(rules)) rules = [];  // 保険
    } catch (e) {
      rules = [];  // JSONパース失敗しても空に
    }
  }

  // 重複チェック
  if (!rules.find(r => r.tag === `#pjt_${slug}`)) {
    rules.unshift({ dest: dir, tag: `#pjt_${slug}`, isRegExp: false });
    await fs.write(rulePath, JSON.stringify(rules, null, 2));
    new Notice(`Rule added: #pjt_${slug} → ${dir}`);
  } else {
    new Notice(`Rule already exists for #pjt_${slug}`);
  }
};