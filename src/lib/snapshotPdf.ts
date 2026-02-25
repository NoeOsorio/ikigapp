import { jsPDF } from "jspdf";
import type { Intersections } from "../models/participant.model";
import { CATEGORIES } from "../constants/categories";

const MATCHA = {
  dark: "#1e2a1a",
  bg: "#e2ebe0",
  accent: "#6b8c5e",
  muted: "#4d6344",
} as const;

const MARGIN = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_HEIGHT = 7;
const SECTION_GAP = 10;
const TITLE_SIZE = 24;
const SUBTITLE_SIZE = 11;
const SECTION_TITLE_SIZE = 13;
const BODY_SIZE = 12;
const SMALL_SIZE = 11;

export interface SnapshotPdfData {
  name: string;
  action: string;
  /** Category answers for "Mis respuestas" section */
  c1: string[];
  c2: string[];
  c3: string[];
  c4: string[];
  intersections?: Intersections | null;
  ikigai?: string | null;
  actions?: string[] | null;
  sessionId?: string | null;
}

function formatDate(): string {
  return new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Splits text into lines that fit within maxWidth. Returns new y position. */
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  lineHeight: number
): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(SECTION_TITLE_SIZE);
  doc.setTextColor(MATCHA.accent);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, y);
  doc.setTextColor(MATCHA.dark);
  doc.setFont("helvetica", "normal");
  return y + LINE_HEIGHT + 4;
}

function addBox(
  doc: jsPDF,
  content: string | string[],
  startY: number,
  fontSize: number = BODY_SIZE
): number {
  const padding = 6;
  const innerW = CONTENT_W - padding * 2;
  doc.setFontSize(fontSize);
  const lines = Array.isArray(content)
    ? content
    : doc.splitTextToSize(content, innerW);
  const boxHeight = padding * 2 + lines.length * LINE_HEIGHT;

  doc.setFillColor(240, 245, 238); // matcha bg tint
  doc.roundedRect(MARGIN, startY, CONTENT_W, boxHeight, 1, 1, "F");
  doc.setDrawColor(107, 140, 94);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN, startY, CONTENT_W, boxHeight, 1, 1, "S");

  let y = startY + padding + fontSize * 0.35;
  doc.setTextColor(MATCHA.dark);
  for (const line of lines) {
    doc.text(line, MARGIN + padding, y);
    y += LINE_HEIGHT;
  }
  return y + padding + SECTION_GAP;
}

function ensurePage(doc: jsPDF, y: number, needSpace: number): number {
  if (y + needSpace > 270) {
    doc.addPage();
    return MARGIN + 15;
  }
  return y;
}

export function buildSnapshotPdf(data: SnapshotPdfData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  // ── Header block (matcha dark) ──
  doc.setFillColor(30, 42, 26); // MATCHA.dark
  doc.rect(0, 0, PAGE_W, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(TITLE_SIZE);
  doc.setFont("helvetica", "bold");
  doc.text(data.name || "Mi Ikigai", MARGIN, 20);
  doc.setFontSize(SUBTITLE_SIZE);
  doc.setFont("helvetica", "normal");
  doc.text(`${formatDate()}  ·  Ikigai`, MARGIN, 30);
  if (data.sessionId) {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    doc.text(`sesión #${data.sessionId.slice(0, 8)}`, MARGIN, 37);
  }
  doc.setTextColor(MATCHA.dark);
  y = 50;

  const hasNewLayout =
    data.intersections != null &&
    (data.ikigai ?? "").trim() !== "" &&
    (data.actions?.length ?? 0) >= 1;

  // ── Mis respuestas (c1–c4) ──
  const hasCategories =
    (data.c1?.length ?? 0) > 0 ||
    (data.c2?.length ?? 0) > 0 ||
    (data.c3?.length ?? 0) > 0 ||
    (data.c4?.length ?? 0) > 0;
  if (hasCategories) {
    y = ensurePage(doc, y, 40);
    y = addSectionTitle(doc, "Mis respuestas por categoría", y);
    const categoryKeys = ["1", "2", "3", "4"] as const;
    for (const step of categoryKeys) {
      const config = CATEGORIES.find((c) => c.step === step);
      const label = config ? config.title : `Categoría ${step}`;
      const items = data[`c${step}` as "c1" | "c2" | "c3" | "c4"] ?? [];
      const text =
        items.length > 0 ? items.join("  ·  ") : "—";
      y = ensurePage(doc, y, 25);
      doc.setFontSize(SMALL_SIZE);
      doc.setTextColor(MATCHA.muted);
      doc.setFont("helvetica", "bold");
      doc.text(label, MARGIN, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(MATCHA.dark);
      y = addWrappedText(doc, text, MARGIN, y, CONTENT_W, BODY_SIZE, LINE_HEIGHT);
      y += SECTION_GAP;
    }
    y += 4;
  }

  if (hasNewLayout) {
    // ── Las cuatro intersecciones ──
    y = ensurePage(doc, y, 60);
    y = addSectionTitle(doc, "Las cuatro intersecciones", y);
    const intersectionTitles: { key: keyof Intersections; label: string }[] = [
      { key: "pasion", label: "Pasión" },
      { key: "mision", label: "Misión" },
      { key: "profesion", label: "Profesión" },
      { key: "vocacion", label: "Vocación" },
    ];
    for (const { key, label } of intersectionTitles) {
      const value = data.intersections?.[key] ?? "—";
      y = ensurePage(doc, y, 22);
      doc.setFontSize(SMALL_SIZE);
      doc.setTextColor(MATCHA.muted);
      doc.setFont("helvetica", "bold");
      doc.text(label, MARGIN, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(MATCHA.dark);
      y = addWrappedText(doc, value, MARGIN, y, CONTENT_W, BODY_SIZE, LINE_HEIGHT);
      y += SECTION_GAP;
    }
    y += 4;

    // ── Mi Ikigai ──
    y = ensurePage(doc, y, 35);
    y = addSectionTitle(doc, "Mi Ikigai", y);
    y = addBox(doc, (data.ikigai ?? "").trim() || "—", y, 14);

    // ── Acciones concretas ──
    y = ensurePage(doc, y, 35);
    y = addSectionTitle(doc, "Acciones concretas", y);
    const actionsList = (data.actions ?? [])
      .filter(Boolean)
      .map((a) => `- ${a}`);
    y = addBox(
      doc,
      actionsList.length > 0 ? actionsList : ["—"],
      y,
      BODY_SIZE
    );
  } else {
    // Legacy: Mi acción
    y = ensurePage(doc, y, 35);
    y = addSectionTitle(doc, "Mi acción", y);
    y = addBox(doc, data.action || "—", y);
  }

  // Download
  const filename = data.name
    ? `ikigai-${data.name.replace(/\s+/g, "-")}.pdf`
    : "ikigai-snapshot.pdf";
  doc.save(filename);
}
