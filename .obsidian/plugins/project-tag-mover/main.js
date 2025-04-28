"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");

class ProjectTagMover extends obsidian_1.Plugin {
    async onload() {
        console.log("ProjectTagMover (command, frontmatter対応版) loading...");
        await this.loadSettings();
        this.addSettingTab(new ProjectTagMoverSettingTab(this.app, this));

        this.addCommand({
            id: "move-note-by-tag",
            name: "Move Note by Tag (Project Tag Mover)",
            callback: async () => {
                await this.moveActiveFile();
            },
        });
    }

    async moveActiveFile() {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
            new obsidian_1.Notice("No active file.");
            return;
        }
        if (!file.path.endsWith(".md")) {
            new obsidian_1.Notice("Not a markdown file.");
            return;
        }

        if (!file.path.startsWith("02_note/")) {
            new obsidian_1.Notice("Only files under '02_note/' can be moved.");
            return;
        }

        const metadata = this.app.metadataCache.getFileCache(file);
        if (!metadata) {
            new obsidian_1.Notice("No metadata found.");
            return;
        }

        let allTags = [];

        // 本文中のtags
        if (metadata.tags) {
            allTags.push(...metadata.tags.map(t => t.tag));
        }

        // frontmatter内のtags
        if (metadata.frontmatter && Array.isArray(metadata.frontmatter.tags)) {
            allTags.push(...metadata.frontmatter.tags);
        }

        console.log("Collected tags:", allTags);

        const projectTag = allTags.find(tag => typeof tag === "string" && tag.startsWith(this.settings.tagPrefix));

        if (!projectTag) {
            new obsidian_1.Notice("No matching project tag found.");
            return;
        }

        const relativePath = projectTag.substring(this.settings.tagPrefix.length);
        await this.moveFileToProject(file, relativePath);
    }

    async moveFileToProject(file, relativePath) {
        const baseFolder = this.settings.rootFolder;
        const targetPath = `${baseFolder}/${relativePath}/${file.name}`;

        try {
            const folderPath = targetPath.substring(0, targetPath.lastIndexOf("/"));
            if (!(await this.app.vault.adapter.exists(folderPath))) {
                await this.app.vault.adapter.mkdir(folderPath);
            }

            await this.app.fileManager.renameFile(file, targetPath);
            new obsidian_1.Notice(`Moved to '${targetPath}'`);
            console.log(`Moved '${file.path}' to '${targetPath}'`);
        } catch (e) {
            console.error("Failed to move file:", e);
            new obsidian_1.Notice("Failed to move file.");
        }
    }

    onunload() {
        console.log("ProjectTagMover (command, frontmatter対応版) unloaded.");
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
exports.default = ProjectTagMover;

const DEFAULT_SETTINGS = {
    tagPrefix: "#pjt/",
    rootFolder: "03_project"
};

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
            .setDesc("Prefix for tags that trigger project moving.")
            .addText(text => text
                .setPlaceholder("#pjt/")
                .setValue(this.plugin.settings.tagPrefix)
                .onChange(async (value) => {
                    this.plugin.settings.tagPrefix = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian_1.Setting(containerEl)
            .setName("Root Folder")
            .setDesc("Root folder where project folders are created.")
            .addText(text => text
                .setPlaceholder("03_project")
                .setValue(this.plugin.settings.rootFolder)
                .onChange(async (value) => {
                    this.plugin.settings.rootFolder = value;
                    await this.plugin.saveSettings();
                }));
    }
}
