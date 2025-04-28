/**
 * タグ → フォルダ振り分け
 * fileArg を渡された場合はそのファイルを対象に処理
 */
module.exports = async (tp, fileArg = null) => {
  const file = fileArg ?? tp.file;          // 外部呼び出しにも対応
  const cfg  = JSON.parse(await tp.file.include('.obsidian/tag-routing.json'));

  const cache = app.metadataCache.getFileCache(file);
  const tags  = (cache?.tags ?? []).map(t => t.tag);
  if (!tags.length) return;

  let targetDir = null;

  // ①明示マッピング優先
  for (const tag of tags) {
    if (cfg.mappings?.[tag]) { targetDir = cfg.mappings[tag]; break; }
  }
  // ②dynamicPrefix (#pjt_*)
  if (!targetDir && cfg.dynamicPrefix && cfg.dynamicBase) {
    const dyn = tags.find(t => t.startsWith(cfg.dynamicPrefix));
    if (dyn) targetDir = `${cfg.dynamicBase}/${dyn.replace(cfg.dynamicPrefix,'').replace(/[^\w\-]/g,'')}`;
  }
  if (!targetDir) return;                   // 対応タグなし

  /* --- フォルダ生成 & ファイル移動 --- */
  const ensure = async p => {
    const parts = p.split('/'); let cur='';
    for (const part of parts){ cur=cur?`${cur}/${part}`:part;
      if(!await app.vault.adapter.exists(cur)) await app.vault.createFolder(cur).catch(()=>{}); }
  };
  await ensure(targetDir);

  const dest = `${targetDir}/${file.basename}.md`;
  if (file.path !== dest) await app.fileManager.renameFile(file,dest);
};
