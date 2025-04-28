// 修正版 new_project.js : Auto Note Mover data.json対応版
module.exports = async (params) => {
  const { quickAddApi: qa, app } = params;
  const slug = await qa.inputPrompt("New project slug (e.g. alpha)");
  if (!slug) return;

  const fs = app.vault.adapter;
  const base = "03_project";
  const dir = `${base}/${slug}`;

  // フォルダ生成
  if (!await fs.exists(dir)) await fs.mkdir(dir);

  // data.json を読む
  const rulePath = ".obsidian/plugins/auto-note-mover/data.json";
  let data = {};  // 初期は空
  if (await fs.exists(rulePath)) {
    try {
      const raw = await fs.read(rulePath);
      data = JSON.parse(raw) || {};
    } catch (e) {
      data = {};
    }
  }

  // folder_tag_patternがなければ作る
  if (!Array.isArray(data.folder_tag_pattern)) {
    data.folder_tag_pattern = [];
  }

  // 同じtagルールがすでに存在するか確認
  const tagToAdd = `#pjt_${slug}`;
  if (!data.folder_tag_pattern.find(r => r.tag === tagToAdd)) {
    data.folder_tag_pattern.push({
      folder: dir,
      tag: tagToAdd,
      pattern: ""
    });
    await fs.write(rulePath, JSON.stringify(data, null, 2));
    new Notice(`Rule added: ${tagToAdd} → ${dir}`);
  } else {
    new Notice(`Rule already exists for ${tagToAdd}`);
  }
};
