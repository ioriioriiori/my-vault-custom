/**
 * tag_router.js  (TFile チェックを extension チェックに変更)
 * --------------------------------------------------
 * 明示マッピング / dynamicPrefix(#pjt_*) による自動振り分け
 */
module.exports = async (tp, fileArg = null) => {
  /* ---------- 対象ファイル ---------- */
  const file = fileArg ?? tp.file;          // TFile オブジェクト
  if (!file) return;
  // ↙ ここを extension チェックに変更（TFile 参照を排除）
  if (file.extension !== 'md') return;

  /* ---------- 設定読み込み ---------- */
  const cfg = JSON.parse(await tp.file.include('.obsidian/tag-routing.json'));

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
      const sub = dyn.replace(cfg.dynamicPrefix,'').replace(/[^\w\-]/g,'');
      targetDir = `${cfg.dynamicBase}/${sub}`;
    }
  }
  if (!targetDir) return;                   // タグ不一致

  /* ---------- フォルダ再帰生成 ---------- */
  const ensure = async p=>{
    const segs=p.split('/'); let cur='';
    for(const s of segs){ cur=cur?`${cur}/${s}`:s;
      if(!await app.vault.adapter.exists(cur))
        await app.vault.createFolder(cur).catch(()=>{}); }
  };
  await ensure(targetDir);

  /* ---------- 移動 ---------- */
  const dest = `${targetDir}/${file.basename}.md`;
  if (file.path === dest) return;

  try {
    await app.fileManager.renameFile(file, dest);
    console.log(`[tag-router] moved: ${file.basename} → ${dest}`);
  } catch (e) {
    console.error('[tag-router] move failed:', e);
  }
};
