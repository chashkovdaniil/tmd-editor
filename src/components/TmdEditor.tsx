import * as React from "react";
import { TmdFile, TmdExercise } from "../TmdParser";
import { App, IconName, setIcon, TFile } from "obsidian";

interface TmdEditorProps {
  tmd: TmdFile;
  refTmd?: (tmd: TmdFile) => void;
  file?: TFile | null;
  app?: App;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dashed";

const editorStyles: Record<string, React.CSSProperties> = {
  page: {
    width: "100%",
    margin: 0,
    padding: 0,
    color: "var(--text-normal)",
  },
  topPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
    padding: "16px 18px",
    border: "1px solid var(--background-modifier-border)",
    borderRadius: 14,
    background: "var(--background-secondary)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
  fileInfo: {
    minWidth: 0,
  },
  overline: {
    display: "block",
    marginBottom: 4,
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  fileName: {
    display: "block",
    overflow: "hidden",
    color: "var(--text-normal)",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.2,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  workoutTitleCard: {
    marginBottom: 12,
    padding: "18px 20px",
    border: "1px solid var(--background-modifier-border)",
    borderRadius: 16,
    background: "linear-gradient(135deg, var(--background-secondary), var(--background-primary))",
  },
  workoutTitle: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.2,
  },
  exerciseCard: {
    margin: "0 0 12px",
    padding: 18,
    border: "1px solid var(--background-modifier-border)",
    borderRadius: 16,
    background: "var(--background-primary)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
  },
  exerciseHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14,
  },
  exerciseTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  exerciseBadge: {
    display: "inline-flex",
    flex: "0 0 auto",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 999,
    background: "var(--interactive-accent)",
    color: "var(--text-on-accent)",
    fontSize: 13,
    fontWeight: 700,
  },
  exerciseName: {
    margin: 0,
    overflow: "hidden",
    fontSize: 21,
    lineHeight: 1.25,
    textOverflow: "ellipsis",
  },
  headerActions: {
    display: "flex",
    flex: "0 0 auto",
    gap: 8,
  },
  note: {
    marginBottom: 14,
    padding: "10px 12px",
    borderLeft: "3px solid var(--interactive-accent)",
    borderRadius: 8,
    background: "var(--background-secondary)",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  tableCell: {
    padding: 8,
    borderBottom: "1px solid var(--background-modifier-border)",
    verticalAlign: "middle",
  },
  tableHeaderCell: {
    padding: "10px 8px",
    borderBottom: "1px solid var(--background-modifier-border)",
    color: "var(--text-muted)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  setNumberCell: {
    width: 1,
    padding: "8px 10px",
    borderBottom: "1px solid var(--background-modifier-border)",
    color: "var(--text-muted)",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  tableInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    border: "1px solid var(--background-modifier-border)",
    borderRadius: 8,
    background: "var(--background-primary)",
    color: "var(--text-normal)",
    outline: "none",
  },
  rowActionsCell: {
    width: 1,
    padding: "6px 8px",
    borderBottom: "1px solid var(--background-modifier-border)",
    whiteSpace: "nowrap",
  },
  rowActions: {
    display: "flex",
    gap: 6,
  },
  exerciseFooter: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  addExerciseBetween: {
    display: "flex",
    margin: "-2px 0 12px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
    background: "rgba(0, 0, 0, 0.45)",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    padding: 22,
    border: "1px solid var(--background-modifier-border)",
    borderRadius: 16,
    background: "var(--background-primary)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.28)",
  },
  modalTitle: {
    marginBottom: 14,
    fontSize: 18,
    fontWeight: 700,
  },
  modalInput: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 14,
    padding: "10px 12px",
    border: "1px solid var(--background-modifier-border)",
    borderRadius: 10,
    background: "var(--background-primary)",
    color: "var(--text-normal)",
    outline: "none",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
  quickActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  error: {
    marginBottom: 10,
    color: "var(--text-error)",
  },
};

const buttonBaseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 34,
  padding: "7px 12px",
  border: "1px solid var(--background-modifier-border)",
  borderRadius: 10,
  background: "var(--background-secondary)",
  color: "var(--text-normal)",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.2,
};

const compactButtonStyle: React.CSSProperties = {
  width: 32,
  minHeight: 32,
  padding: 0,
};

const disabledButtonStyle: React.CSSProperties = {
  cursor: "not-allowed",
  opacity: 0.5,
};

const buttonVariantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    borderColor: "var(--interactive-accent)",
    background: "var(--interactive-accent)",
    color: "var(--text-on-accent)",
  },
  secondary: {},
  ghost: {
    borderColor: "transparent",
    background: "transparent",
    color: "var(--text-muted)",
  },
  danger: {
    borderColor: "var(--text-error)",
    background: "transparent",
    color: "var(--text-error)",
  },
  dashed: {
    borderColor: "var(--interactive-accent)",
    borderStyle: "dashed",
    background: "transparent",
    color: "var(--interactive-accent)",
  },
};

interface EditorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  compact?: boolean;
  variant?: ButtonVariant;
}

const EditorButton: React.FC<EditorButtonProps> = ({
  compact = false,
  disabled = false,
  style,
  variant = "secondary",
  ...buttonProps
}) => (
  <button
    {...buttonProps}
    disabled={disabled}
    style={{
      ...buttonBaseStyle,
      ...buttonVariantStyles[variant],
      ...(compact ? compactButtonStyle : {}),
      ...(disabled ? disabledButtonStyle : {}),
      ...style,
    }}
  />
);

interface ObsidianIconProps {
  icon: IconName;
}

const ObsidianIcon: React.FC<ObsidianIconProps> = ({ icon }) => {
  const iconRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (iconRef.current) {
      iconRef.current.textContent = "";
      setIcon(iconRef.current, icon);
    }
  }, [icon]);

  return <span ref={iconRef} aria-hidden="true" />;
};

interface EditorModalProps {
  actions: React.ReactNode;
  children?: React.ReactNode;
  title: string;
}

const EditorModal: React.FC<EditorModalProps> = ({ actions, children, title }) => (
  <div style={editorStyles.modalOverlay}>
    <div style={editorStyles.modal}>
      <div style={editorStyles.modalTitle}>{title}</div>
      {children}
      <div style={editorStyles.modalActions}>{actions}</div>
    </div>
  </div>
);

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

  // Очистить подход (строку) от текста, не удаляя её
  const handleClearRow = (exerciseIdx: number, rowIdx: number) => {
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = exercises[exerciseIdx].table.map(row => [...row]);
      if (table[rowIdx]) {
        for (let col = 0; col < table[rowIdx].length; col++) {
          table[rowIdx][col] = "";
        }
      }
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], table };
      return { ...prev, exercises };
    });
  };

  // Очистить только вторую колонку строки подхода
  const handleClearSecondColumn = (exerciseIdx: number, rowIdx: number) => {
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = exercises[exerciseIdx].table.map(row => [...row]);
      if (table[rowIdx] && table[rowIdx].length > 1) {
        table[rowIdx][1] = "";
      }
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], table };
      return { ...prev, exercises };
    });
  };

  // Скопировать значения из предыдущей строки (кроме заголовка)
  const handleCopyPreviousRow = (exerciseIdx: number, rowIdx: number) => {
    if (rowIdx <= 1) return;
    setTmd(prev => {
      setDirty(true);
      const exercises = [...prev.exercises];
      const table = exercises[exerciseIdx].table.map(row => [...row]);
      const prevRow = table[rowIdx - 1];
      const currentRow = table[rowIdx];
      if (prevRow && currentRow) {
        for (let col = 0; col < currentRow.length; col++) {
          currentRow[col] = prevRow[col] || "";
        }
      }
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], table };
      return { ...prev, exercises };
    });
  };

  // Delete exercise
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

  // Edit exercise name
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
    <div style={editorStyles.page}>
      {file && (
        <div style={editorStyles.topPanel}>
          <div style={editorStyles.fileInfo}>
            <span style={editorStyles.overline}>Файл тренировки</span>
            <span style={editorStyles.fileName}>{file.basename}</span>
          </div>
          <EditorButton
            title="Переименовать файл"
            variant="secondary"
            onClick={handleShowFileNameDialog}
          >
            Переименовать
          </EditorButton>
        </div>
      )}
      {tmd.title && (
        <div style={editorStyles.workoutTitleCard}>
          <span style={editorStyles.overline}>Тренировка</span>
          <h2 style={editorStyles.workoutTitle}>{tmd.title}</h2>
        </div>
      )}
      {tmd.exercises.map((ex, idx) => (
        <React.Fragment key={idx}>
          <section style={editorStyles.exerciseCard}>
            <div style={editorStyles.exerciseHeader}>
              <div style={editorStyles.exerciseTitleRow}>
                <span style={editorStyles.exerciseBadge}>{idx + 1}</span>
                <h3 style={editorStyles.exerciseName}>{ex.name}</h3>
              </div>
              <div style={editorStyles.headerActions}>
                <EditorButton
                  compact
                  title="Редактировать название"
                  variant="ghost"
                  onClick={() => handleEditExercise(idx, ex.name)}
                >
                  ✎
                </EditorButton>
                <EditorButton
                  compact
                  title="Удалить упражнение"
                  variant="danger"
                  onClick={() => handleDeleteExercise(idx)}
                >
                  <ObsidianIcon icon="trash-2" />
                </EditorButton>
              </div>
            </div>
            {ex.note && <div style={editorStyles.note}>{ex.note}</div>}
            <div style={editorStyles.tableWrap}>
              <table style={editorStyles.table}>
                <tbody>
                  {ex.table.map((row, rIdx) => {
                    const isLastRow = rIdx === ex.table.length - 1;
                    const borderBottom = isLastRow
                      ? "none"
                      : "1px solid var(--background-modifier-border)";
                    const cellStyle = {
                      ...(rIdx === 0 ? editorStyles.tableHeaderCell : editorStyles.tableCell),
                      borderBottom,
                    };
                    const actionsCellStyle = {
                      ...editorStyles.rowActionsCell,
                      borderBottom,
                    };
                    const setNumberCellStyle = {
                      ...editorStyles.setNumberCell,
                      borderBottom,
                    };

                    return (
                      <tr key={rIdx}>
                        <td style={setNumberCellStyle}>
                          {rIdx === 0 ? "#" : rIdx}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            style={cellStyle}
                          >
                            {rIdx === 0 ? (
                              cell
                            ) : (
                              <input
                                type="text"
                                value={cell}
                                onChange={e => handleCellChange(idx, rIdx, cIdx, e.target.value)}
                                style={editorStyles.tableInput}
                              />
                            )}
                          </td>
                        ))}
                        {rIdx !== 0 && (
                          <td style={actionsCellStyle}>
                            <div style={editorStyles.rowActions}>
                              {rIdx > 1 && (
                                <EditorButton
                                  compact
                                  onClick={() => handleCopyPreviousRow(idx, rIdx)}
                                  title="Скопировать предыдущую строку"
                                  variant="ghost"
                                >
                                  <ObsidianIcon icon="copy" />
                                </EditorButton>
                              )}
                              <EditorButton
                                compact
                                onClick={() => handleClearRow(idx, rIdx)}
                                title="Очистить подход"
                                variant="ghost"
                              >
                                🧹
                              </EditorButton>
                              <EditorButton
                                compact
                                onClick={() => handleClearSecondColumn(idx, rIdx)}
                                title="Очистить вторую колонку"
                                variant="ghost"
                              >
                                🧽
                              </EditorButton>
                              <EditorButton
                                compact
                                onClick={() => handleRemoveRow(idx, rIdx)}
                                title="Удалить подход"
                                variant="danger"
                              >
                                ×
                              </EditorButton>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={editorStyles.exerciseFooter}>
              <EditorButton
                onClick={() => handleAddRow(idx)}
                style={{ width: "100%" }}
                variant="primary"
              >
                + Подход
              </EditorButton>
            </div>
          </section>
          <div style={editorStyles.addExerciseBetween}>
            <EditorButton
              onClick={() => handleShowAddExercise(idx)}
              style={{ width: "100%" }}
              variant="dashed"
            >
              + Упражнение
            </EditorButton>
          </div>
        </React.Fragment>
      ))}
      {showDialog && (
        <EditorModal
          title="Новое упражнение"
          actions={(
            <>
              <EditorButton onClick={() => setShowDialog(false)}>Отмена</EditorButton>
              <EditorButton
                disabled={!newExerciseName.trim()}
                onClick={handleAddExercise}
                variant="primary"
              >
                Добавить
              </EditorButton>
            </>
          )}
        >
          <input
            type="text"
            value={newExerciseName}
            onChange={e => setNewExerciseName(e.target.value)}
            style={editorStyles.modalInput}
            placeholder="Название упражнения"
            autoFocus
          />
        </EditorModal>
      )}
      {showDeleteDialog && (
        <EditorModal
          title="Удалить упражнение?"
          actions={(
            <>
              <EditorButton onClick={cancelDeleteExercise}>Нет</EditorButton>
              <EditorButton onClick={confirmDeleteExercise} variant="danger">
                Да, удалить
              </EditorButton>
            </>
          )}
        />
      )}
      {showEditDialog && (
        <EditorModal
          title="Переименовать упражнение"
          actions={(
            <>
              <EditorButton onClick={cancelEditExercise}>Отмена</EditorButton>
              <EditorButton
                disabled={!editName.trim()}
                onClick={confirmEditExercise}
                variant="primary"
              >
                Сохранить
              </EditorButton>
            </>
          )}
        >
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            style={editorStyles.modalInput}
            placeholder="Название упражнения"
            autoFocus
          />
        </EditorModal>
      )}
      {showFileNameDialog && (
        <EditorModal
          title="Переименовать файл"
          actions={(
            <>
              <EditorButton onClick={handleFileNameCancel}>Отмена</EditorButton>
              <EditorButton
                disabled={!fileNameInput.trim()}
                onClick={handleFileNameSave}
                variant="primary"
              >
                Сохранить
              </EditorButton>
            </>
          )}
        >
          <input
            type="text"
            value={fileNameInput}
            onChange={e => { setFileNameInput(e.target.value); setFileNameError(""); }}
            style={editorStyles.modalInput}
            placeholder="Имя файла"
            autoFocus
          />
          <div style={editorStyles.quickActions}>
            <EditorButton type="button" onClick={handleFileNameDate}>
              {getCurrentDateStr()}
            </EditorButton>
            <EditorButton type="button" compact onClick={() => handleFileNameEmoji('л')}>
              л
            </EditorButton>
            <EditorButton type="button" compact onClick={() => handleFileNameEmoji('т')}>
              т
            </EditorButton>
            <EditorButton type="button" compact onClick={() => handleFileNameEmoji('🎒')}>
              🎒
            </EditorButton>
            <EditorButton type="button" compact onClick={() => handleFileNameEmoji('🦵🏼')}>
              🦵🏼
            </EditorButton>
            <EditorButton type="button" compact onClick={() => handleFileNameEmoji('➡️')}>
              ➡️
            </EditorButton>
          </div>
          {fileNameError && <div style={editorStyles.error}>{fileNameError}</div>}
        </EditorModal>
      )}
    </div>
  );
};
