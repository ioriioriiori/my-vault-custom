"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
class ProjectTagMover extends obsidian_1.Plugin {
    async onload() {
        console.log("ProjectTagMover loading...");
        await this.loadSettings();
        this.addSettingTab(new ProjectTagMoverSettingTab(this.app, this));
        this.registerEvent(this.app.vault.on("modify", async (file) => {
            if (!(file instanceof obsidian_1.TFile))
                return;
            if (!file.path.endsWith(".md"))
                return;
            const metadata = this.app.metadataCache.getFileCache(file);
            if (!metadata || !metadata.tags)
                return;
            const tags = metadata.tags.map(t => t.tag);
            for (const tag of tags) {
                if (tag.startsWith(this.settings.tagPrefix)) {
                    const relativePath = tag.substring(this.settings.tagPrefix.length);
                    await this.moveFileToProject(file, relativePath);
                    break;
                }
            }
        }));
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
            console.log(`Moved '${file.path}' to '${targetPath}'`);
        }
        catch (e) {
            console.error("Failed to move file:", e);
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
