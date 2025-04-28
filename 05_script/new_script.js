// new_project.js  – QuickAdd v1.x 用
module.exports = async (params) => {
    // v1 では quickAddApi という名前で渡されます
    const { quickAddApi: qa, app } = params;
  
    const slug = await qa.inputPrompt("New project slug (e.g. alpha)");
    if (!slug) return;
  
    const fs   = app.vault.adapter;
    const base = "03_project";
    const dir  = `${base}/${slug}`;
  
    // フォルダ生成
    if (!await fs.exists(dir)) await fs.mkdir(dir);
  
    // Auto Note Mover の rules.json を更新
    const rulePath = ".obsidian/plugins/auto-note-mover/rules.json";
    let rules = [];
    if (await fs.exists(rulePath)) {
      rules = JSON.parse(await fs.read(rulePath));
    }
    if (!rules.find(r => r.tag === `#pjt_${slug}`)) {
      rules.unshift({ dest: dir, tag: `#pjt_${slug}`, isRegExp: false });
      await fs.write(rulePath, JSON.stringify(rules, null, 2));
      new Notice(`Rule added: #pjt_${slug} → ${dir}`);
    } else {
      new Notice(`Rule already exists for #pjt_${slug}`);
    }
  };
  