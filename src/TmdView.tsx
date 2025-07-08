import { ItemView, WorkspaceLeaf, TFile, Notice, FileView } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TmdEditor } from "./components/TmdEditor";
import { parseTmd, serializeTmd, TmdFile } from "./TmdParser";

export const TMD_VIEW_TYPE = "tmd-view";

export class TmdView extends FileView {
  private tmdFile: TmdFile | null = null;
  private isLoaded: boolean = false;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    console.log("[TMD] TmdView: constructor", leaf);
  }

  getViewType() {
    console.log("[TMD] TmdView: getViewType");
    return TMD_VIEW_TYPE;
  }

  getDisplayText() {
    console.log("[TMD] TmdView: getDisplayText");
    return "TMD Workout Editor";
  }

  async onLoadFile(file: TFile) {
    console.log("[TMD] TmdView: onLoadFile", file.path);
    const content = await this.app.vault.read(file);
    const tmd = parseTmd(content);
    this.tmdFile = tmd;
    this.isLoaded = true;
    this.renderEditor();
  }

  renderEditor() {
    console.log("[TMD] TmdView: renderEditor", this.isLoaded, this.tmdFile);
    if (!this.isLoaded || !this.tmdFile) {
      ReactDOM.render(
        <div style={{ padding: 32, textAlign: "center" }}>Загрузка...</div>,
        this.containerEl.children[1]
      );
      return;
    }
    const refTmd = async (newTmd: TmdFile) => {
      this.tmdFile = newTmd;
      if (this.file) {
        const md = serializeTmd(this.tmdFile);
        await this.app.vault.modify(this.file, md);
        new Notice("Файл автосохранён");
        console.log("[TMD] TmdView: Файл автосохранён", this.file.path);
      }
    };
    ReactDOM.render(
      <TmdEditor tmd={this.tmdFile} refTmd={refTmd} file={this.file} app={this.app} />,
      this.containerEl.children[1]
    );
    console.log("[TMD] TmdView: React-компонент отрендерен");
  }

  async onOpen() {
    console.log("[TMD] TmdView: onOpen");
    this.isLoaded = false;
    this.tmdFile = null;
    this.renderEditor();
  }

  async onClose() {
    console.log("[TMD] TmdView: onClose");
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
} 