import { Plugin, WorkspaceLeaf, TFolder, TFile, App, PluginSettingTab, Setting } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TmdView, TMD_VIEW_TYPE } from "./TmdView";

interface TmdSettings {
  showAutoSaveNotification: boolean;
}

const DEFAULT_SETTINGS: TmdSettings = {
  showAutoSaveNotification: true
};

export default class TmdPlugin extends Plugin {
  settings: TmdSettings = DEFAULT_SETTINGS;

  async onload() {
    console.log("[TMD] Плагин загружен");
    
    await this.loadSettings();
    
    this.addSettingTab(new TmdSettingTab(this.app, this));
    
    this.registerView(
      TMD_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => {
        console.log(`[TMD] Создаётся кастомный view для leaf`, leaf);
        return new TmdView(leaf, this);
      }
    );
    console.log(`[TMD] Регистрирую расширение .tmd для view: ${TMD_VIEW_TYPE}`);
    this.registerExtensions(["tmd"], TMD_VIEW_TYPE);

    // Добавляем пункт в контекстное меню файлового дерева
    this.registerEvent(
      this.app.workspace.on(
        'file-menu',
        async (menu, file, source) => {
          // Добавляем пункт создания tmd-файла
          menu.addItem((item) => {
            item.setTitle('Create tmd file')
              .setIcon('plus-square')
              .onClick(async () => {
                const folder = file instanceof TFolder ? file : file.parent;
                if (!folder) {
                  // @ts-ignore
                  new this.app.Notice('Could not determine folder for file creation');
                  return;
                }
                const now = new Date();
                const pad = (n: number) => n.toString().padStart(2, '0');
                const dateStr = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear().toString().slice(-2)}`;
                let baseName = dateStr;
                let ext = '.tmd';
                let name = baseName + ext;
                let i = 1;
                // Проверяем, что имя уникально
                while (this.app.vault.getAbstractFileByPath(folder.path + '/' + name)) {
                  name = `${baseName} ${i}${ext}`;
                  i++;
                }
                const filePath = folder.path + '/' + name;
                const template = '### Новое упражнение\n| Вес | Повторы |\n| --- | ------- |\n|     |         |\n';
                const newFile = await this.app.vault.create(filePath, template);
                const leaf = this.app.workspace.getLeaf(true);
                // @ts-ignore
                await leaf.openFile(newFile, { active: true });
              });
          });

          // Добавляем пункт дублирования md -> tmd
          if (file instanceof TFile && file.extension === 'md') {
            menu.addItem((item) => {
              item.setTitle('Duplicate as tmd')
                .setIcon('copy')
                .onClick(async () => {
                  const folder = file.parent;
                  if (!folder) {
                    // @ts-ignore
                    new this.app.Notice('Could not determine folder for duplication');
                    return;
                  }
                  const baseName = file.name.replace(/\.md$/, '');
                  let ext = '.tmd';
                  let name = baseName + '(d)' + ext;
                  let i = 1;
                  while (this.app.vault.getAbstractFileByPath(folder.path + '/' + name)) {
                    name = `${baseName} ${i}${ext}`;
                    i++;
                  }
                  const filePath = folder.path + '/' + name;
                  const content = await this.app.vault.read(file);
                  const newFile = await this.app.vault.create(filePath, content);
                  const leaf = this.app.workspace.getLeaf(true);
                  // @ts-ignore
                  await leaf.openFile(newFile, { active: true });
                });
            });
          }
        }
      )
    );
  }

  onunload() {
    console.log("[TMD] Плагин выгружен, удаляю кастомные view");
    this.app.workspace.detachLeavesOfType(TMD_VIEW_TYPE);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class TmdSettingTab extends PluginSettingTab {
  plugin: TmdPlugin;

  constructor(app: App, plugin: TmdPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "TMD Editor Settings" });

    new Setting(containerEl)
      .setName("Показывать уведомление об автосохранении")
      .setDesc("Включить/выключить уведомление 'Файл автосохранён' при сохранении изменений")
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showAutoSaveNotification)
        .onChange(async (value) => {
          this.plugin.settings.showAutoSaveNotification = value;
          await this.plugin.saveSettings();
        }));
  }
} 