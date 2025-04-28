"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");

/* ---------- デフォルト設定 ---------- */
const DEFAULT_SETTINGS = {
  tagPrefix: "#pjt/",
  rootFolder: "03_project"
};

/* ---------- プラグイン本体 ---------- */
class ProjectTagMover extends obsidian_1.Plugin {
  /* 起動時 */
  async onload() {
    console.log("ProjectTagMover (front-matter & body版) loading…");
    await this.loadSettings();
    this.addSettingTab(new ProjectTagMoverSettingTab(this.app, this));

    /* コマンド登録 */
    this.addCommand({
      id: "move-note-by-tag",
      name: "Move Note by Tag (Project Tag Mover)",
      callback: async () => await this.moveActiveFile()
    });
  }

  /* アクティブファイルを処理 */
  async moveActiveFile() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !file.path.endsWith(".md")) {
      new obsidian_1.Notice("アクティブな Markdown ファイルがありません。");
      return;
    }

    /* 1. ファイル内容を取得 */
    let content;
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      console.error("読み込み失敗:", e);
      new obsidian_1.Notice("ファイル読込に失敗しました。");
      return;
    }

    /* 2. フロントマターから tags を抽出 */
    const tags = [];
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (fmMatch) {
      try {
        const fmObj = (0, obsidian_1.parseYaml)(fmMatch[1]);
        if (fmObj.tags) {
          const fmTags = Array.isArray(fmObj.tags) ? fmObj.tags : [fmObj.tags];
          tags.push(...fmTags.map(t => String(t)));
        }
      } catch (e) {
        console.warn("YAML 解析に失敗:", e);
      }
    }

    /* 3. 本文から #pjt/… を抽出（フロントマター部を除外） */
    const body = fmMatch ? content.slice(fmMatch[0].length) : content;
    const prefixEsc = this.settings.tagPrefix.replace("/", "\\/");
    const bodyRegex = new RegExp(`${prefixEsc}[^\\s#]+`, "g");
    const bodyMatches = body.match(bodyRegex);
    if (bodyMatches) tags.push(...bodyMatches);

    /* 4. 最初に見つかった #pjt/ タグを使用 */
    const first = tags.find(t => t.startsWith(this.settings.tagPrefix));
    if (!first) {
      new obsidian_1.Notice("対応する #pjt タグが見つかりません。");
      return;
    }

    const relativePath = first.substring(this.settings.tagPrefix.length);
    await this.moveFileToProject(file, relativePath);
  }

  /* 5. ファイルを指定フォルダへ移動 */
  async moveFileToProject(file, relativePath) {
    const targetPath = `${this.settings.rootFolder}/${relativePath}/${file.name}`;
    const folderPath = targetPath.substring(0, targetPath.lastIndexOf("/"));

    try {
      if (!(await this.app.vault.adapter.exists(folderPath))) {
        await this.app.vault.adapter.mkdir(folderPath);
      }
      await this.app.fileManager.renameFile(file, targetPath);
      new obsidian_1.Notice(`Moved to '${targetPath}'`);
      console.log(`Moved '${file.path}' → '${targetPath}'`);
    } catch (e) {
      console.error("移動失敗:", e);
      new obsidian_1.Notice("ファイル移動に失敗しました。");
    }
  }

  /* 終了処理 */
  onunload() {
    console.log("ProjectTagMover unloaded.");
  }

  /* 設定ロード／保存 */
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
exports.default = ProjectTagMover;

/* ---------- 設定画面 ---------- */
class ProjectTagMoverSettingTab extends obsidian_1.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Project Tag Mover Settings" });

    new obsidian_1.Setting(containerEl)
      .setName("Tag Prefix")
      .setDesc("タグ判定に使う接頭辞（例: #pjt/）")
      .addText(t => t
        .setPlaceholder("#pjt/")
        .setValue(this.plugin.settings.tagPrefix)
        .onChange(async v => {
          this.plugin.settings.tagPrefix = v.trim();
          await this.plugin.saveSettings();
        }));

    new obsidian_1.Setting(containerEl)
      .setName("Root Folder")
      .setDesc("プロジェクトフォルダを作成する親ディレクトリ")
      .addText(t => t
        .setPlaceholder("03_project")
        .setValue(this.plugin.settings.rootFolder)
        .onChange(async v => {
          this.plugin.settings.rootFolder = v.trim();
          await this.plugin.saveSettings();
        }));
  }
}
