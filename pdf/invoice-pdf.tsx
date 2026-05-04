import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";
import { formatLps, formatDate } from "@/lib/format";
import { numeroALetras } from "@/lib/numero-letras";

type InvoiceItem = {
  quantity: number; description: string; unitPrice: number;
  discount: number; total: number; isvRate: number; order: number;
};

type Invoice = {
  id: string; number: string; issueDate: Date; tipoPago: string;
  cai: string; rangoDesde: string; rangoHasta: string;
  fechaRecepcion: Date; fechaLimiteEmision: Date;
  ordenCompraExenta?: string | null; regExonerados?: string | null; regSag?: string | null;
  carnetDiplomatico?: string | null; exportacionCA: boolean; exportacionFueraCA: boolean;
  exonerado: number; descuento: number; exento: number;
  gravado15: number; gravado18: number; isv15: number; isv18: number; total: number;
  items: InvoiceItem[];
  client: { nombre: string; rtn: string };
};

type Company = {
  name: string; legalName: string; rtn: string; address: string;
  phone: string; celular: string; email: string; cai: string; rangoDesde: string; rangoHasta: string;
  fechaRecepcion: Date; fechaLimiteEmision: Date;
};

const MIN_ROWS = 9;

export function InvoicePdf({ invoice, company, logoSrc }: { invoice: Invoice; company: Company; logoSrc: string }) {
  const rows = [...invoice.items];
  while (rows.length < MIN_ROWS) {
    rows.push({ quantity: 0, description: "", unitPrice: 0, discount: 0, total: 0, isvRate: 15, order: rows.length });
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* Sección 1 — Logo + FACTURA DE CRÉDITO */}
        <View style={{ alignItems: "center", marginBottom: 3 }}>
          <Image src={logoSrc} style={{ width: 532, height: 80, objectFit: "contain" }} />
        </View>
        <View style={styles.facturaBox}>
          <Text style={styles.facturaBoxText}>{invoice.tipoPago === "CREDITO" ? "FACTURA DE CRÉDITO" : "FACTURA DE CONTADO"}</Text>
        </View>

        {/* Nombre empresa + número factura */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.companyName}>{company.legalName}</Text>
            <Text style={styles.rtnSmall}>RTN: {company.rtn}</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 3 }}>
            <View style={styles.invoiceNumRow}>
              <Text style={[styles.invoiceNumLabel, { paddingLeft: 44 }]}>Factura:</Text>
              <Text style={styles.invoiceNumValue}>{invoice.number}</Text>
            </View>
            <View style={styles.invoiceNumRow}>
              <Text style={styles.invoiceNumLabel}>Fecha de Emisión:</Text>
              <Text style={styles.dateBox}>{formatDate(invoice.issueDate)}</Text>
            </View>
          </View>
        </View>

        {/* Sección 2 — Datos del Emisor */}
        <View style={styles.issuerRow}>
          <Text><Text style={styles.bold}>Dirección: </Text>{company.address}</Text>
          <Text style={{ marginTop: 2 }}>
            {company.celular ? <><Text style={styles.bold}>Cel: </Text>{company.celular}{"   "}</> : null}
            <Text style={styles.bold}>Tel: </Text>{company.phone}{"   "}
            <Text style={styles.bold}>Correo: </Text>{company.email}
          </Text>
          <Text style={[styles.bold, { marginTop: 10 }]}>CAI: {company.cai}</Text>
        </View>

        {/* Sección 3 — Datos del Cliente */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
          <View style={{ flex: 1, flexDirection: "row", border: "1pt solid #000" }}>
            <Text style={styles.clientLabel}>CLIENTE:</Text>
            <Text style={[styles.clientValue, { borderRight: undefined }]}>{invoice.client.nombre}</Text>
          </View>
          <View style={{ flexDirection: "row", border: "1pt solid #000" }}>
            <Text style={styles.clientLabel}>RTN:</Text>
            <Text style={styles.rtnValue}>{invoice.client.rtn}</Text>
          </View>
        </View>

        {/* Sección 4 — Exoneración */}
        <View style={styles.exoBox}>
          <View style={styles.exoRow}>
            {[
              { label: "No. Orden de Compra Exenta:", value: invoice.ordenCompraExenta },
              { label: "No. Reg. de Exonerados:", value: invoice.regExonerados },
              { label: "No. Reg. de la SAG:", value: invoice.regSag, last: true },
            ].map((cell, i) => (
              <View key={i} style={cell.last ? styles.exoCellLast : styles.exoCell}>
                <Text style={styles.exoLabel}>{cell.label}</Text>
                <Text style={styles.exoValue}>{cell.value || ""}</Text>
              </View>
            ))}
          </View>
          <View style={styles.exoCheckRow}>
            <View style={styles.exoCheckCell}>
              <Text style={styles.exoLabel}>Carnet Diplomático:</Text>
              <Text style={styles.exoValue}>{invoice.carnetDiplomatico || ""}</Text>
            </View>
            {[
              { label: "Exportacion a Centro America", checked: invoice.exportacionCA },
              { label: "Exportación fuera de Centro America", checked: invoice.exportacionFueraCA, last: true },
            ].map((cell, i) => (
              <View key={i} style={cell.last ? styles.exoCheckCellLast : styles.exoCheckCell}>
                <Text style={styles.checkLabel}>{cell.label}</Text>
                <Text style={[styles.exoValue, { textAlign: "center" }]}>{cell.checked ? "X" : ""}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sección 5 — Tabla de Ítems */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thCant}>Cantidad</Text>
            <Text style={styles.thDesc}>Descripción</Text>
            <Text style={styles.thPrice}>Precio Uni.</Text>
            <Text style={styles.thDisc}>{"Descuentos y\nRebajas"}</Text>
            <Text style={styles.thTotal}>Total</Text>
          </View>
          {rows.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tdCant}>{item.description ? String(item.quantity) : ""}</Text>
              <Text style={styles.tdDesc}>{item.description}</Text>
              <Text style={styles.tdPrice}>{item.description ? formatLps(item.unitPrice) : ""}</Text>
              <Text style={styles.tdDisc}>{item.discount > 0 ? formatLps(item.discount) : item.description ? "—" : ""}</Text>
              <Text style={styles.tdTotal}>{item.description ? formatLps(item.total) : "0.00"}</Text>
            </View>
          ))}
        </View>

        {/* Sección 6 — Totales + Metadata Fiscal */}
        <View style={styles.totalsSection}>
          <View style={styles.fiscalMeta}>
            <Text><Text style={styles.bold}>Fecha Recepcion: </Text>{formatDate(invoice.fechaRecepcion)}</Text>
            <Text><Text style={styles.bold}>Fecha Limite de Emision: </Text>{formatDate(invoice.fechaLimiteEmision)}</Text>
            <Text><Text style={styles.bold}>Rango Autorizado: </Text>{invoice.rangoDesde} al {invoice.rangoHasta}</Text>
          </View>
          <View style={styles.totalsTable}>
            {[
              { label: "EXONERADO",   value: invoice.exonerado, bold: false },
              { label: "DESCUENTO",   value: invoice.descuento, bold: false },
              { label: "GRAVADO 15%", value: invoice.gravado15, bold: true },
              { label: "GRAVADO 18%", value: invoice.gravado18, bold: false },
              { label: "ISV 15%",     value: invoice.isv15,     bold: false },
              { label: "ISV 18%",     value: invoice.isv18,     bold: false },
              { label: "EXENTAS:",    value: invoice.exento,    bold: false },
            ].map((row) => (
              <View key={row.label} style={row.bold ? styles.totalRowHighlight : styles.totalRow}>
                <Text style={row.bold ? styles.totalLabelHighlight : styles.totalLabel}>{row.label}</Text>
                <Text style={row.bold ? styles.totalValueHighlight : styles.totalValue}>{formatLps(row.value)}</Text>
              </View>
            ))}
            <View style={styles.totalRowBold}>
              <Text style={styles.totalLabelBold}>TOTAL LPS.</Text>
              <Text style={styles.totalValueBold}>{formatLps(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* Sección 7 — Valor en Letras */}
        <View style={styles.valorRow}>
          <Text style={styles.valorLabel}>Valor en Letras:</Text>
          <Text style={styles.valorBox}>{numeroALetras(invoice.total)}</Text>
        </View>
        <Text style={styles.slogan}>La Factura es Beneficio de todos "EXIJALA"</Text>

        {/* Sección 8 — Footer */}
        <View style={styles.footerSignature}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>FIRMA</Text>
        </View>
        <View style={styles.footerCopies}>
          <Text style={styles.footerCopy}>Original: Cliente</Text>
          <Text style={styles.footerCopy}>Copia1: Contabilidad</Text>
          <Text style={styles.footerCopy}>Copia 2: Obligado Tributario Emisor</Text>
        </View>

      </Page>
    </Document>
  );
}
