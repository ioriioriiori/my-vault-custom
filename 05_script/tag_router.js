/**
 * tag_router.js  (2025-04-29 修正版)
 * --------------------------------------------------
 * ・明示マッピング or dynamicPrefix(#pjt_*) でフォルダ振り分け
 * ・フォルダが無ければ再帰的に自動生成
 * ・Obsidian API renameFile() を使うのでテンプレ展開中でも安全
 * ・tp.user.tag_router(tp) だけで実行可
 *     └ fileArg を渡せば任意ファイルを処理（リスナー用）
 *
 * 必要ファイル:
 *   .obsidian/tag-routing.json
 *   {
 *     "scanOnSave": true,
 *     "mappings": {
 *       "#Concept":  "03_projects/Concept",
 *       "#RuleSpec": "03_projects/RuleSpec",
 *       "#TestPlay": "03_projects/TestPlay",
 *       "#Spec":     "03_projects/Spec"
 *     },
 *     "dynamicPrefix": "#pjt_",
 *     "dynamicBase":   "03_projects"
 *   }
 */

module.exports = async (tp, fileArg = null) => {
  /* ---------- 対象ファイル & 設定読み込み ---------- */
  const file = fileArg ?? tp.file;  // 外部から渡された TFile か、実行時のノート
  if (!file || !(file instanceof TFile) || !file.path.endsWith('.md')) return;

  const cfgRaw = await tp.file.include('.obsidian/tag-routing.json');
  const cfg    = JSON.parse(cfgRaw);

  /* ---------- タグを取得 (metadataCache の方が高速) ---------- */
  const cache = app.metadataCache.getFileCache(file);
  const tags  = (cache?.tags ?? []).map(t => t.tag);
  if (tags.length === 0) return;

  /* ---------- 1) 明示マッピング優先 ---------- */
  let targetDir = null;
  for (const tag of tags) {
    if (cfg.mappings?.[tag]) {
      targetDir = cfg.mappings[tag];
      break;
    }
  }

  /* ---------- 2) dynamicPrefix (#pjt_*) ---------- */
  if (!targetDir && cfg.dynamicPrefix && cfg.dynamicBase) {
    const dyn = tags.find(t => t.startsWith(cfg.dynamicPrefix));
    if (dyn) {
      const sub = dyn.replace(cfg.dynamicPrefix, '')
                     .replace(/[^\w\-]/g, '');      // 安全な dir 名に
      targetDir = `${cfg.dynamicBase}/${sub}`;
    }
  }

  if (!targetDir) return;             // 対応タグが無ければ何もしない

  /* ---------- フォルダを再帰生成 ---------- */
  const ensureFolder = async (path) => {
    const parts = path.split('/');
    let cur = '';
    for (const part of parts) {
      cur = cur ? `${cur}/${part}` : part;
      if (!await app.vault.adapter.exists(cur)) {
        await app.vault.createFolder(cur).catch(() => {/* フォルダ競合は無視 */});
      }
    }
  };
  await ensureFolder(targetDir);

  /* ---------- 目的地パス ---------- */
  const destPath = `${targetDir}/${file.basename}.md`;

  if (file.path === destPath) return; // 既に正しい場所なら終了

  /* ---------- ファイル移動 (安全) ---------- */
  try {
    await app.fileManager.renameFile(file, destPath);
    console.log(`[tag-router] moved: ${file.basename} → ${destPath}`);
  } catch (err) {
    console.error('[tag-router] move failed:', err);
  }
};
