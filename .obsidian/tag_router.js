/**
 * タグ → フォルダ自動振り分け
 *  - 明示的 mappings か、dynamicPrefix(#pjt_) に一致したタグで移動
 *  - 必要なフォルダは再帰的に自動生成
 *  - 対応タグが無い場合は何もしない
 */
module.exports = async (tp) => {
    /* ── 設定読込 ───────────────────────────────── */
    const cfg = JSON.parse(await tp.file.include('.obsidian/tag-routing.json'));
    if (!cfg.scanOnSave) return;
  
    const tags = await tp.file.tags();          // ex: ['#Concept', '#pjt_alpha']
    if (!tags.length) return;
  
    /* ── ① 明示マッピングを優先チェック ──────── */
    let targetDir = null;
    for (const tag of tags) {
      if (cfg.mappings?.[tag]) {
        targetDir = cfg.mappings[tag];
        break;
      }
    }
  
    /* ── ② dynamicPrefix(#pjt_) で動的に決定 ─── */
    if (!targetDir && cfg.dynamicPrefix && cfg.dynamicBase) {
      const dynTag = tags.find(t => t.startsWith(cfg.dynamicPrefix));
      if (dynTag) {
        //   '#pjt_alpha' → 'alpha'
        const sub = dynTag.replace(cfg.dynamicPrefix, '').replace(/[^\w\-]/g, '');
        targetDir = `${cfg.dynamicBase}/${sub}`;
      }
    }
  
    if (!targetDir) return;                     // 該当なし → 終了
  
    /* ── フォルダを再帰生成 ───────────────────── */
    const { vault } = app;
    async function ensureFolder(path) {
      const segments = path.split('/');
      let cur = '';
      for (const seg of segments) {
        cur = cur ? `${cur}/${seg}` : seg;
        if (!await vault.adapter.exists(cur)) {
          await vault.createFolder(cur).catch(() => {});   // 既存なら無視
        }
      }
    }
    await ensureFolder(targetDir);
  
    /* ── ノートを移動 ────────────────────────── */
    const dest = `${targetDir}/${tp.file.title}.md`;
    if (tp.file.path === dest) return;
  
    try {
      await tp.file.move(dest);
      console.log(`[tag-router] moved: ${tp.file.title} → ${dest}`);
    } catch (e) {
      console.error('[tag-router] move failed:', e);
    }
  };
  