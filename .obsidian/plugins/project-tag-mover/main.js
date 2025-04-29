"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const {
  Plugin,
  Notice,
  parseYaml,
  PluginSettingTab,
  Setting,
  TFile
} = require("obsidian");

/* ---------- デフォルト設定 ---------- */
const DEFAULT_SETTINGS = {
  tagPrefix: "#pjt/",
  rootFolder: "03_project"
};

/* ---------- プラグイン本体 ---------- */
class ProjectTagMover extends Plugin {
  async onload() {
    console.log("ProjectTagMover loading…");
    await this.loadSettings();
    this.addSettingTab(new ProjectTagMoverSettingTab(this.app, this));

    /* コマンド登録 */
    this.addCommand({
      id: "move-note-by-tag",
      name: "Move Note by Tag (Project Tag Mover)",
      callback: async () => await this.moveActiveFile()
    });
  }

  async moveActiveFile() {
    const file = this.app.workspace.getActiveFile();
    if (!(file instanceof TFile) || !file.path.endsWith(".md")) {
      new Notice("アクティブな Markdown ファイルがありません。");
      return;
    }

    let content;
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      console.error("ファイル読み込み失敗:", e);
      new Notice("ファイル読込に失敗しました。");
      return;
    }

    const tags = [];

    // 1) YAML frontmatter の tags 抽出
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (fmMatch) {
      try {
        const fmObj = parseYaml(fmMatch[1]);
        if (fmObj && fmObj.tags) {
          const fmTags = Array.isArray(fmObj.tags) ? fmObj.tags : [fmObj.tags];
          tags.push(...fmTags.map(t => String(t)));
        }
      } catch (e) {
        console.warn("YAML 解析に失敗:", e);
      }
    }

    // 2) 本文から #pjt/xxx を抽出 (frontmatter 部は除外)
    const body = fmMatch ? content.slice(fmMatch[0].length) : content;
    // プレフィックス先頭の # はあってもなくても OK に
    const rawPrefix = this.settings.tagPrefix.replace(/^#/, "");
    const prefixEsc = rawPrefix.replace("/", "\\/");
    const regex = new RegExp(`[#]?${prefixEsc}[^\\s#]+`, "g");
    const bodyMatches = body.match(regex);
    if (bodyMatches) {
      tags.push(...bodyMatches);
    }

    console.log("検出したタグリスト:", tags);

    // 3) 最初にマッチした #?pjt/... を採用
    const first = tags
      .map(t => String(t).replace(/^["'#]+|["']+$/g, "").replace(/^#/, ""))
      .find(t => t.startsWith(rawPrefix));

    if (!first) {
      new Notice("対応する pjt/ タグが見つかりません。");
      return;
    }

    const relativePath = first.substring(rawPrefix.length);
    await this.moveFileToProject(file, relativePath);
  }

  async moveFileToProject(file, relativePath) {
    const targetPath = `${this.settings.rootFolder}/${relativePath}/${file.name}`;
    const folderPath = targetPath.substring(0, targetPath.lastIndexOf("/"));

    try {
      if (!(await this.app.vault.adapter.exists(folderPath))) {
        await this.app.vault.adapter.mkdir(folderPath);
      }
      await this.app.fileManager.renameFile(file, targetPath);
      new Notice(`Moved to '${targetPath}'`);
      console.log(`Moved '${file.path}' → '${targetPath}'`);
    } catch (e) {
      console.error("移動失敗:", e);
      new Notice("ファイル移動に失敗しました。");
    }
  }

  onunload() {
    console.log("ProjectTagMover unloaded.");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
exports.default = ProjectTagMover;

/* ---------- 設定画面 ---------- */
class ProjectTagMoverSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Project Tag Mover Settings" });

    new Setting(containerEl)
      .setName("Tag Prefix")
      .setDesc("タグ判定に使う接頭辞（例: #pjt/ または pjt/）")
      .addText(text =>
        text
          .setPlaceholder("#pjt/")
          .setValue(this.plugin.settings.tagPrefix)
          .onChange(async value => {
            this.plugin.settings.tagPrefix = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Root Folder")
      .setDesc("プロジェクトフォルダを作成する親ディレクトリ")
      .addText(text =>
        text
          .setPlaceholder("03_project")
          .setValue(this.plugin.settings.rootFolder)
          .onChange(async value => {
            this.plugin.settings.rootFolder = value.trim();
            await this.plugin.saveSettings();
          })
      );
  }
}
