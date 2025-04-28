/**
 * Obsidian 起動時に一度だけ走り、保存イベントを監視して
 * tag_router を自動実行するリスナーを登録する
 */
module.exports = (tp) => {
    // 300ms デバウンスして無限ループを防止
    const debounce = (fn, ms=300) => {
      let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a), ms); };
    };
  
    const onModify = debounce(async (file) => {
      // md 以外／テンプレ用フォルダなどは除外
      if (!file || file.extension !== 'md') return;
      await tp.user.tag_router(tp, file);
    });
  
    // Obsidian のファイル更新イベントをフック
    app.vault.on('modify', onModify);
  };
  