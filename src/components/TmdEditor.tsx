import * as React from "react";
import { TmdFile, TmdExercise } from "../TmdParser";
import { App, TFile } from "obsidian";

interface TmdEditorProps {
  tmd: TmdFile;
  refTmd?: (tmd: TmdFile) => void;
  file?: TFile | null;
  app?: App;
}

export const TmdEditor: React.FC<TmdEditorProps> = ({ tmd: initialTmd, refTmd, file, app }) => {
  const [tmd, setTmd] = React.useState<TmdFile>(initialTmd);
  const [dirty, setDirty] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [newExerciseName, setNewExerciseName] = React.useState("");
  const [addAfterIdx, setAddAfterIdx] = React.useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = React.useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [editIdx, setEditIdx] = React.useState<number | null>(null);
  const [editName, setEditName] = React.useState("");
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  // --- Состояния для редактирования имени файла ---
  const [showFileNameDialog, setShowFileNameDialog] = React.useState(false);
  const [fileNameInput, setFileNameInput] = React.useState(file ? file.basename : "");
  const [fileNameError, setFileNameError] = React.useState("");

  React.useEffect(() => {
    if (file) setFileNameInput(file.basename);
  }, [file]);

  const handleShowFileNameDialog = () => {
    if (file) setFileNameInput(file.basename);
    setFileNameError("");
    setShowFileNameDialog(true);
  };

  const handleFileNameEmoji = (emoji: string) => {
    setFileNameInput((prev) => prev + emoji);
  };

  const handleFileNameSave = async () => {
    if (!file || !app) return;
    const newName = fileNameInput.trim();
    if (!newName) {
      setFileNameError("Имя файла не может быть пустым");
      return;
    }
    if (newName === file.basename) {
      setShowFileNameDialog(false);
      return;
    }
    if (!file.parent) {
      setFileNameError("Не удалось определить папку файла");
      return;
    }
    const newPath = file.parent.path + "/" + newName + "." + file.extension;
    if (app.vault.getAbstractFileByPath(newPath)) {
      setFileNameError("Файл с таким именем уже существует");
      return;
    }
    await app.vault.rename(file, newPath);
    setShowFileNameDialog(false);
  };

  const handleFileNameCancel = () => {
    setShowFileNameDialog(false);
    setFileNameError("");
    if (file) setFileNameInput(file.basename);
  };

  // Получить текущую дату в формате dd.MM.YY
  const getCurrentDateStr = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear().toString().slice(-2)}`;
  };

  const handleFileNameDate = () => {
    setFileNameInput(getCurrentDateStr());
    setFileNameError("");
  };

  // Сброс состояния при изменении initialTmd (например, при открытии нового файла)
  React.useEffect(() => {
    setTmd(initialTmd);
    setDirty(false);
  }, [initialTmd]);

  // Автосохранение только если были реальные изменения
  React.useEffect(() => {
    if (dirty && refTmd) refTmd(tmd);
  }, [tmd, dirty, refTmd]);

  // Добавить подход (строку) в таблицу упражнения
  const handleAddRow = (exerciseIdx: number) => {
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = [...exercises[exerciseIdx].table];
      const emptyRow = new Array(table[0]?.length || 2).fill("");
      table.push(emptyRow);
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], table };
      console.log(`[TMD] TmdEditor: Добавлен подход в упражнение #${exerciseIdx}`);
      return { ...prev, exercises };
    });
  };

  // Открыть диалог для добавления упражнения
  const handleShowAddExercise = (afterIdx: number) => {
    setAddAfterIdx(afterIdx);
    setShowDialog(true);
    setNewExerciseName("");
    console.log(`[TMD] TmdEditor: Открыт диалог добавления упражнения после #${afterIdx}`);
  };

  // Добавить новое упражнение
  const handleAddExercise = () => {
    if (!newExerciseName.trim() || addAfterIdx === null) return;
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = [
        ["Вес", "Повторы"],
        ["", ""],
        ["", ""],
        ["", ""]
      ];
      const newExercise: TmdExercise = { name: newExerciseName.trim(), table };
      exercises.splice(addAfterIdx + 1, 0, newExercise);
      console.log(`[TMD] TmdEditor: Добавлено упражнение '${newExerciseName.trim()}' после #${addAfterIdx}`);
      return { ...prev, exercises };
    });
    setShowDialog(false);
    setNewExerciseName("");
    setAddAfterIdx(null);
  };

  // Редактирование ячейки таблицы
  const handleCellChange = (exerciseIdx: number, rowIdx: number, colIdx: number, value: string) => {
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = exercises[exerciseIdx].table.map(row => [...row]);
      table[rowIdx][colIdx] = value;
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], table };
      console.log(`[TMD] TmdEditor: Изменена ячейка [${exerciseIdx}][${rowIdx}][${colIdx}] -> '${value}'`);
      return { ...prev, exercises };
    });
  };

  // Удалить подход (строку) из таблицы упражнения
  const handleRemoveRow = (exerciseIdx: number, rowIdx: number) => {
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = exercises[exerciseIdx].table.filter((_, i) => i !== rowIdx);
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], table };
      return { ...prev, exercises };
    });
  };

  // Удалить упражнение
  const handleDeleteExercise = (idx: number) => {
    setDeleteIdx(idx);
    setShowDeleteDialog(true);
  };

  const confirmDeleteExercise = () => {
    if (deleteIdx === null) return;
    setTmd(prev => {
      setDirty(true);
      const exercises = prev.exercises.filter((_, i) => i !== deleteIdx);
      return { ...prev, exercises };
    });
    setShowDeleteDialog(false);
    setDeleteIdx(null);
  };

  const cancelDeleteExercise = () => {
    setShowDeleteDialog(false);
    setDeleteIdx(null);
  };

  // Редактировать название упражнения
  const handleEditExercise = (idx: number, currentName: string) => {
    setEditIdx(idx);
    setEditName(currentName);
    setShowEditDialog(true);
  };

  const confirmEditExercise = () => {
    if (editIdx === null || !editName.trim()) return;
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      exercises[editIdx] = { ...exercises[editIdx], name: editName.trim() };
      return { ...prev, exercises };
    });
    setShowEditDialog(false);
    setEditIdx(null);
    setEditName("");
  };

  const cancelEditExercise = () => {
    setShowEditDialog(false);
    setEditIdx(null);
    setEditName("");
  };

  React.useEffect(() => {
    console.log("[TMD] TmdEditor: Монтирование компонента");
    return () => {
      console.log("[TMD] TmdEditor: Размонтирование компонента");
    };
  }, []);

  return (
    <div>
      {/* Верхняя панель с названием файла и кнопкой редактирования */}
      {file && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <span style={{ fontWeight: 600, fontSize: 20 }}>{file.basename}</span>
          <button
            style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
            title="Переименовать файл"
            onClick={handleShowFileNameDialog}
          >
            ✎
          </button>
        </div>
      )}
      {tmd.title && <h2>{tmd.title}</h2>}
      {tmd.exercises.map((ex, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0 }}>{ex.name}</h3>
            <button
              style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
              title="Редактировать название"
              onClick={() => handleEditExercise(idx, ex.name)}
            >
              ✎
            </button>
            <button
              style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              title="Удалить упражнение"
              onClick={() => handleDeleteExercise(idx)}
            >
              ×
            </button>
          </div>
          {ex.note && <div style={{ fontStyle: "italic", marginBottom: 8 }}>{ex.note}</div>}
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {ex.table.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ border: "1px solid #ccc", padding: 4 }}>
                      {rIdx === 0 ? (
                        <b>{cell}</b>
                      ) : (
                        <input
                          type="text"
                          value={cell}
                          onChange={e => handleCellChange(idx, rIdx, cIdx, e.target.value)}
                          style={{ width: "100%", boxSizing: "border-box" }}
                        />
                      )}
                    </td>
                  ))}
                  {/* Кнопка удаления подхода (кроме заголовка) */}
                  {rIdx !== 0 && (
                    <td>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => handleRemoveRow(idx, rIdx)}
                        title="Удалить подход"
                      >
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ marginTop: 8 }} onClick={() => handleAddRow(idx)}>
            + Добавить подход
          </button>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => handleShowAddExercise(idx)}>
              + Добавить упражнение
            </button>
          </div>
        </div>
      ))}
      {showDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <div style={{ marginBottom: 12 }}>Название упражнения:</div>
            <input
              type="text"
              value={newExerciseName}
              onChange={e => setNewExerciseName(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
              autoFocus
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setShowDialog(false)}>Отмена</button>
              <button onClick={handleAddExercise} disabled={!newExerciseName.trim()}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <div style={{ marginBottom: 16 }}>Удалить упражнение?</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={cancelDeleteExercise}>Нет</button>
              <button style={{ color: 'red' }} onClick={confirmDeleteExercise}>Да</button>
            </div>
          </div>
        </div>
      )}
      {showEditDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
            <div style={{ marginBottom: 12 }}>Новое название упражнения:</div>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
              autoFocus
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={cancelEditExercise}>Отмена</button>
              <button onClick={confirmEditExercise} disabled={!editName.trim()}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
      {/* Диалог редактирования имени файла */}
      {showFileNameDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 320 }}>
            <div style={{ marginBottom: 12 }}>Новое имя файла:</div>
            <input
              type="text"
              value={fileNameInput}
              onChange={e => { setFileNameInput(e.target.value); setFileNameError(""); }}
              style={{ width: "100%", marginBottom: 12 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button type="button" onClick={handleFileNameDate}>{getCurrentDateStr()}</button>
              <button type="button" onClick={() => handleFileNameEmoji('🎒')}>🎒</button>
              <button type="button" onClick={() => handleFileNameEmoji('🦵🏼')}>🦵🏼</button>
              <button type="button" onClick={() => handleFileNameEmoji('➡️')}>➡️</button>
            </div>
            {fileNameError && <div style={{ color: 'red', marginBottom: 8 }}>{fileNameError}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={handleFileNameCancel}>Отмена</button>
              <button onClick={handleFileNameSave} disabled={!fileNameInput.trim()}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 