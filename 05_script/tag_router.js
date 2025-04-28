/**
 * tag_router.js  (2025-04-29 final)
 * --------------------------------------------------
 * 明示マッピング＋dynamicPrefix(#pjt_*) 自動振り分け
 * - フォルダ自動生成
 * - Obsidian 公式 API のみ使用（Templater 依存なし）
 */
module.exports = async (tp, fileArg = null) => {
  /* ---------- 対象ファイル ---------- */
  const file = fileArg ?? tp.file;
  if (!file || file.extension !== 'md') return;

  /* ---------- 設定読み込み ---------- */
  // ❶: include() をやめ、Vault API で JSON を読む
  const cfgRaw = await app.vault.adapter.read('.obsidian/tag-routing.json');
  const cfg    = JSON.parse(cfgRaw);

  /* ---------- タグ取得 ---------- */
  const cache = app.metadataCache.getFileCache(file);
  const tags  = (cache?.tags ?? []).map(t => t.tag);
  if (tags.length === 0) return;

  /* ---------- 1) 明示マッピング ---------- */
  let targetDir = null;
  for (const tag of tags) {
    if (cfg.mappings?.[tag]) { targetDir = cfg.mappings[tag]; break; }
  }

  /* ---------- 2) dynamicPrefix (#pjt_*) ---------- */
  if (!targetDir && cfg.dynamicPrefix && cfg.dynamicBase) {
    const dyn = tags.find(t => t.startsWith(cfg.dynamicPrefix));
    if (dyn) {
      const sub = dyn.replace(cfg.dynamicPrefix, '').replace(/[^\w\-]/g, '');
      targetDir = `${cfg.dynamicBase}/${sub}`;
    }
  }
  if (!targetDir) return;            // タグ該当なし

  /* ---------- フォルダを再帰生成 ---------- */
  const ensure = async p => {
    const segs = p.split('/'); let cur = '';
    for (const s of segs) {
      cur = cur ? `${cur}/${s}` : s;
      if (!await app.vault.adapter.exists(cur))
        await app.vault.createFolder(cur).catch(() => {});
    }
  };
  await ensure(targetDir);

  /* ---------- ファイル移動 ---------- */
  const dest = `${targetDir}/${file.basename}.md`;
  if (file.path === dest) return;

  try {
    await app.fileManager.renameFile(file, dest);
    console.log(`[tag-router] moved: ${file.basename} → ${dest}`);
  } catch (e) {
    console.error('[tag-router] move failed:', e);
  }
};
