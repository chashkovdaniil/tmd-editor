// import { TmdExercise, TmdFile } from "./TmdParser";

export interface TmdExercise {
  name: string;
  note?: string;
  table: string[][]; // каждая строка — массив ячеек
}

export interface TmdFile {
  title?: string;
  exercises: TmdExercise[];
}

function parseTable(lines: string[]): string[][] {
  if (lines.length === 0) return [];
  const result: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());
    // Пропускаем строки, где все ячейки состоят только из дефисов или пустые
    if (row.every(cell => /^-+$/.test(cell) || cell === "")) continue;
    result.push(row);
  }
  console.log("[TMD] TmdParser: parseTable", result);
  return result;
}

export function parseTmd(content: string): TmdFile {
  console.log("[TMD] TmdParser: parseTmd входные данные", content);
  const lines = content.split(/\r?\n/);
  let i = 0;
  let title: string | undefined = undefined;
  const exercises: TmdExercise[] = [];

  // Заголовок тренировки
  if (lines[i] && lines[i].startsWith("[[") && lines[i].endsWith("]]")) {
    title = lines[i].slice(2, -2).trim();
    i++;
  }

  // Пропустить пустые строки
  while (lines[i] && lines[i].trim() === "") i++;

  while (i < lines.length) {
    // Сбор заметок до упражнения
    let noteLines: string[] = [];
    while (i < lines.length && !lines[i].startsWith("### ")) {
      if (lines[i].trim() !== "") noteLines.push(lines[i]);
      i++;
    }
    let note = noteLines.length > 0 ? noteLines.join("\n") : undefined;

    // Если дошли до конца файла — выходим
    if (i >= lines.length) break;

    // Если нашли упражнение
    if (lines[i].startsWith("### ")) {
      const name = lines[i].slice(4).trim();
      i++;

      // Пропустить пустые строки после заголовка упражнения
      while (lines[i] && lines[i].trim() === "") i++;

      // Сбор таблицы (включая пустые строки между строками таблицы)
      let tableLines: string[] = [];
      while (i < lines.length) {
        if (lines[i].trim() === "") {
          i++;
          continue;
        }
        if (lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
          continue;
        }
        break;
      }
      const table = parseTable(tableLines);

      exercises.push({ name, note, table });
      console.log(`[TMD] TmdParser: упражнение '${name}'`, { note, table });
    }

    // Пропустить все строки до следующего упражнения (включая пустые и мусорные)
    while (i < lines.length && !lines[i].startsWith("### ")) i++;
  }

  const result = { title, exercises };
  console.log("[TMD] TmdParser: результат парсинга", result);
  return result;
}

export function serializeTmd(tmd: TmdFile): string {
  console.log("[TMD] TmdParser: serializeTmd", tmd);
  const lines: string[] = [];
  if (tmd.title) {
    lines.push(`[[${tmd.title}]]`);
    lines.push("");
  }
  tmd.exercises.forEach(ex => {
    if (ex.note) {
      lines.push(...ex.note.split("\n"));
    }
    lines.push(`### ${ex.name}`);
    ex.table.forEach(row => {
      lines.push(`| ${row.join(" | ")} |`);
    });
    lines.push("");
  });
  const result = lines.join("\n").replace(/\n+$/g, "\n");
  console.log("[TMD] TmdParser: результат сериализации", result);
  return result;
} 