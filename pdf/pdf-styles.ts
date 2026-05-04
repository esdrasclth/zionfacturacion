import { StyleSheet } from "@react-pdf/renderer";

// LETTER: 612×792pt, padding 20pt → usable width: 572pt
export const styles = StyleSheet.create({
  page: { backgroundColor: "#FFFFFF", padding: 20, fontFamily: "Helvetica", fontSize: 10 },

  // Header
  facturaBox: { border: "1pt solid #000", paddingVertical: 9, marginBottom: 5 },
  facturaBoxText: { fontSize: 19, fontWeight: "heavy", textAlign: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 },
  companyName: { color: "#1d4ed8", fontWeight: "bold", fontSize: 14 },
  rtnSmall: { fontSize: 9 },
  invoiceNumRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 0 },
  invoiceNumLabel: { fontWeight: "bold", fontSize: 11, width: 100 },
  invoiceNumValue: { fontWeight: "bold", fontSize: 11 },
  dateBox: { backgroundColor: "#000000", color: "#FFFFFF", fontWeight: "bold", paddingHorizontal: 5, paddingVertical: 2, fontSize: 11 },

  // Sección 2 — Emisor
  issuerRow: { borderTop: "0.5pt solid #d1d5db", borderBottom: "0.5pt solid #d1d5db", paddingVertical: 4, marginBottom: 5, fontSize: 9 },
  bold: { fontWeight: "bold" },

  // Sección 3 — Cliente
  clientRow: { flexDirection: "row", border: "1pt solid #000", marginBottom: 4 },
  clientLabel: { backgroundColor: "#f3f4f6", color: "#000", fontWeight: "bold", paddingHorizontal: 6, paddingVertical: 4, fontSize: 9, justifyContent: "center" },
  clientValue: { flex: 1, backgroundColor: "#000", color: "#FFF", paddingHorizontal: 6, paddingVertical: 4, fontSize: 9, borderRight: "1pt solid #000" },
  rtnValue: { width: 120, backgroundColor: "#000", color: "#FFF", paddingHorizontal: 6, paddingVertical: 4, fontSize: 9 },

  // Sección 4 — Exoneración
  exoBox: { border: "1pt solid #000", marginBottom: 4 },
  exoRow: { flexDirection: "row" },
  exoCell: { flex: 1, borderRight: "0.5pt solid #000", paddingHorizontal: 5, paddingVertical: 3 },
  exoCellLast: { flex: 1, paddingHorizontal: 5, paddingVertical: 3 },
  exoLabel: { fontSize: 8, fontWeight: "bold" },
  exoValue: { fontSize: 9, height: 16, backgroundColor: "#f3f4f6", paddingHorizontal: 2, paddingVertical: 3, marginTop: 4 },
  exoCheckRow: { flexDirection: "row", borderTop: "0.5pt solid #000" },
  exoCheckCell: { flex: 1, borderRight: "0.5pt solid #000", paddingHorizontal: 5, paddingVertical: 3 },
  exoCheckCellLast: { flex: 1, paddingHorizontal: 5, paddingVertical: 3 },
  checkLabel: { fontSize: 8, fontWeight: "bold" },
  checkBoxFilled: { height: 10, backgroundColor: "#000", marginTop: 2 },
  checkBoxEmpty: { height: 10, backgroundColor: "#e5e7eb", marginTop: 2 },

  // Sección 5 — Tabla ítems
  // Usable width 572pt. Cols: Cant=40, Desc=flex, Precio=75, Disc=84, Total=75
  table: { border: "1pt solid #000", marginBottom: 5 },
  tableHeader: { flexDirection: "row", backgroundColor: "#000", color: "#FFF" },
  tableRow: { flexDirection: "row", borderTop: "0.5pt solid #000" },
  thCant:  { width: 55,  textAlign: "center", fontWeight: "bold", paddingHorizontal: 3, paddingVertical: 3, borderRight: "0.5pt solid #555", fontSize: 9 },
  thDesc:  { flex: 1,    fontWeight: "bold",  paddingHorizontal: 3, paddingVertical: 3, borderRight: "0.5pt solid #555", fontSize: 9 },
  thPrice: { width: 75,  textAlign: "center", fontWeight: "bold", paddingHorizontal: 3, paddingVertical: 3, borderRight: "0.5pt solid #555", fontSize: 9 },
  thDisc:  { width: 84,  textAlign: "center", fontWeight: "bold", paddingHorizontal: 3, paddingVertical: 3, borderRight: "0.5pt solid #555", fontSize: 8 },
  thTotal: { width: 75,  textAlign: "center", fontWeight: "bold", paddingHorizontal: 3, paddingVertical: 3, fontSize: 9 },
  tdCant:  { width: 55,  textAlign: "center", paddingHorizontal: 3, paddingVertical: 2, borderRight: "0.5pt solid #000", fontSize: 9 },
  tdDesc:  { flex: 1,    paddingHorizontal: 3, paddingVertical: 2, borderRight: "0.5pt solid #000", fontSize: 9 },
  tdPrice: { width: 75,  textAlign: "right",  paddingHorizontal: 3, paddingVertical: 2, borderRight: "0.5pt solid #000", fontSize: 9 },
  tdDisc:  { width: 84,  textAlign: "right",  paddingHorizontal: 3, paddingVertical: 2, borderRight: "0.5pt solid #000", fontSize: 9 },
  tdTotal: { width: 75,  textAlign: "right",  paddingHorizontal: 3, paddingVertical: 2, fontSize: 9 },

  // Sección 6 — Totales + Metadata fiscal
  totalsSection: { flexDirection: "row", gap: 10, marginBottom: 5 },
  fiscalMeta: { flex: 1, fontSize: 9, gap: 3 },
  // w-52 en HTML = 208px → ~156pt; using 165 for slight padding
  totalsTable: { width: 165, border: "1pt solid #000" },
  totalRow: { flexDirection: "row", borderTop: "0.5pt solid #000" },
  totalLabel: { flex: 1, paddingHorizontal: 5, paddingVertical: 2, fontSize: 9, borderRight: "0.5pt solid #000" },
  totalValue: { width: 65, textAlign: "right", paddingHorizontal: 5, paddingVertical: 2, fontSize: 9 },
  totalRowHighlight: { flexDirection: "row", borderTop: "0.5pt solid #000", backgroundColor: "#f9fafb" },
  totalLabelHighlight: { flex: 1, paddingHorizontal: 5, paddingVertical: 2, fontSize: 9, fontWeight: "bold", borderRight: "0.5pt solid #000" },
  totalValueHighlight: { width: 65, textAlign: "right", paddingHorizontal: 5, paddingVertical: 2, fontSize: 9, fontWeight: "bold" },
  totalRowBold: { flexDirection: "row", borderTop: "1pt solid #000" },
  totalLabelBold: { flex: 1, paddingHorizontal: 5, paddingVertical: 3, fontSize: 11, fontWeight: "bold", borderRight: "0.5pt solid #000" },
  totalValueBold: { width: 65, textAlign: "right", paddingHorizontal: 5, paddingVertical: 3, fontSize: 11, fontWeight: "bold" },

  // Sección 7 — Valor en letras
  valorRow: { flexDirection: "row", alignItems: "center", marginBottom: 5, gap: 5 },
  valorLabel: { fontWeight: "bold", fontSize: 9 },
  valorBox: { flex: 1, backgroundColor: "#000", color: "#FFF", paddingHorizontal: 10, paddingVertical: 5, fontSize: 9, fontWeight: "bold" },
  slogan: { textAlign: "center", fontSize: 9, fontStyle: "italic", marginBottom: 10 },

  // Sección 8 — Footer
  footerSignature: { alignSelf: "flex-end", width: 120, alignItems: "center", marginBottom: 8 },
  signatureLine: { borderBottom: "1pt solid #000", width: "100%", height: 28 },
  signatureLabel: { fontSize: 9, fontWeight: "bold", textAlign: "center", marginTop: 2 },
  footerCopies: { flexDirection: "row", borderTop: "0.5pt solid #000", paddingTop: 3 },
  footerCopy: { flex: 1, textAlign: "center", fontSize: 8 },
});
