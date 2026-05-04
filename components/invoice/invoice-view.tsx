import Image from "next/image";
import { formatLps, formatDate } from "@/lib/format";
import { numeroALetras } from "@/lib/numero-letras";

type InvoiceItem = {
  id: string; quantity: number; description: string;
  unitPrice: number; discount: number; total: number; isvRate: number; order: number;
};

const LABEL_PAGO: Record<string, string> = {
  CONTADO: "Al Contado", CREDITO: "Crédito", TRANSFERENCIA: "Transferencia", CHEQUE: "Cheque",
};

type Invoice = {
  id: string; number: string; issueDate: Date; status: string; tipoPago: string;
  cai: string; rangoDesde: string; rangoHasta: string;
  fechaRecepcion: Date; fechaLimiteEmision: Date;
  ordenCompraExenta?: string | null; regExonerados?: string | null; regSag?: string | null;
  carnetDiplomatico?: string | null; exportacionCA: boolean; exportacionFueraCA: boolean;
  subtotal: number; descuento: number; exonerado: number; exento: number;
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

export function InvoiceView({ invoice, company }: { invoice: Invoice; company: Company }) {
  const rows = [...invoice.items];
  while (rows.length < MIN_ROWS) {
    rows.push({ id: `empty-${rows.length}`, quantity: 0, description: "", unitPrice: 0, discount: 0, total: 0, isvRate: 15, order: rows.length });
  }

  return (
    <div className="bg-white font-sans text-black text-xs" style={{ width: "794px", padding: "20px", boxSizing: "border-box" }}>

      {/* Sección 1 — Header */}
      <div className="text-center mb-2">
        <div className="flex justify-center mb-1">
          <Image src="/logo.png" alt={company.name} width={720} height={120} style={{ objectFit: "contain", width: "100%", maxHeight: "90px" }} priority />
        </div>
        <div className="block w-full border border-black py-2.5 text-2xl font-black uppercase mt-1 text-center">
          {invoice.tipoPago === "CREDITO" ? "FACTURA DE CRÉDITO" : "FACTURA DE CONTADO"}
        </div>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-blue-700 font-bold text-lg">{company.legalName}</div>
          <div className="text-xs">RTN: {company.rtn}</div>
        </div>
        <div className="text-sm" style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "0 8px", alignItems: "center" }}>
          <span className="font-bold">Factura:</span>
          <span className="font-mono">{invoice.number}</span>
          <span className="font-bold">Fecha de Emisión:</span>
          <span className="bg-black text-white font-bold px-2 py-0.5">{formatDate(invoice.issueDate)}</span>
        </div>
      </div>

      {/* Sección 2 — Datos del Emisor */}
      <div className="text-xs mb-3 border-t border-b border-gray-300 py-1.5">
        <div><span className="font-bold">Dirección:</span> {company.address}</div>
        <div>
          {company.celular && <><span className="font-bold">Cel:</span> {company.celular} &nbsp;</>}
          <span className="font-bold">Tel:</span> {company.phone} &nbsp;
          <span className="font-bold">Correo:</span> {company.email}
        </div>
        <div className="font-bold mt-3">CAI: {company.cai}</div>
      </div>

      {/* Sección 3 — Datos del Cliente */}
      <div className="flex mb-2 gap-2">
        <div className="flex flex-1 border border-black">
          <div className="bg-gray-100 text-black font-bold px-2 py-1 flex items-center text-xs whitespace-nowrap border-r border-black">CLIENTE:</div>
          <div className="flex-1 bg-black text-white px-2 py-1 text-xs">{invoice.client.nombre}</div>
        </div>
        <div className="flex border border-black">
          <div className="bg-gray-100 text-black font-bold px-2 py-1 flex items-center text-xs whitespace-nowrap border-r border-black">RTN:</div>
          <div className="w-40 bg-black text-white px-2 py-1 text-xs font-mono">{invoice.client.rtn}</div>
        </div>
      </div>

      {/* Sección 4 — Campos de Exoneración */}
      <div className="mb-2 border border-black">
        <div className="grid grid-cols-3 divide-x divide-black">
          {[
            { label: "No. Orden de Compra Exenta:", value: invoice.ordenCompraExenta },
            { label: "No. Reg. de Exonerados:", value: invoice.regExonerados },
            { label: "No. Reg. de la SAG:", value: invoice.regSag },
          ].map((cell, i) => (
            <div key={i} className="px-2 py-1 text-xs">
              <div className="font-bold text-[10px]">{cell.label}</div>
              <div className="text-xs h-6 mt-1.5 bg-gray-100 px-1 flex items-center">{cell.value}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 divide-x divide-black border-t border-black">
          <div className="px-2 py-1 text-xs">
            <div className="font-bold text-[10px]">Carnet Diplomático:</div>
            <div className="text-xs h-6 mt-1.5 bg-gray-100 px-1 flex items-center">{invoice.carnetDiplomatico}</div>
          </div>
          {[
            { label: "Exportacion a Centro America", checked: invoice.exportacionCA },
            { label: "Exportación fuera de Centro America", checked: invoice.exportacionFueraCA },
          ].map((item, i) => (
            <div key={i} className="px-2 py-1">
              <div className="text-[10px] font-bold">{item.label}</div>
              <div className="h-6 mt-1.5 bg-gray-100 flex items-center justify-center text-xs">
                {item.checked ? "X" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 5 — Tabla de Ítems */}
      <table className="w-full border border-black mb-2" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-black text-white text-center text-[10px]">
            <th className="border border-gray-600 px-1 py-1 w-12">Cantidad</th>
            <th className="border border-gray-600 px-1 py-1 text-left">Descripción</th>
            <th className="border border-gray-600 px-1 py-1 w-24">Precio Uni.</th>
            <th className="border border-gray-600 px-1 py-1 w-28">Descuentos y<br />Rebajas</th>
            <th className="border border-gray-600 px-1 py-1 w-24">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => (
            <tr key={item.id || i} className="text-xs">
              <td className="border border-black px-1 py-1 text-center">{item.description ? item.quantity : ""}</td>
              <td className="border border-black px-1 py-1">{item.description}</td>
              <td className="border border-black px-1 py-1 text-right">{item.description ? formatLps(item.unitPrice) : ""}</td>
              <td className="border border-black px-1 py-1 text-right">{item.discount > 0 ? formatLps(item.discount) : item.description ? "—" : ""}</td>
              <td className="border border-black px-1 py-1 text-right">{item.description ? formatLps(item.total) : "0.00"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección 6 — Totales + Metadata Fiscal */}
      <div className="flex gap-4 mb-2">
        <div className="flex-1 text-xs space-y-0.5">
          <div><span className="font-bold">Fecha Recepcion:</span> {formatDate(invoice.fechaRecepcion)}</div>
          <div><span className="font-bold">Fecha Limite de Emision:</span> {formatDate(invoice.fechaLimiteEmision)}</div>
          <div><span className="font-bold">Rango Autorizado:</span> {invoice.rangoDesde} al {invoice.rangoHasta}</div>
        </div>
        <div className="w-52">
          <table className="w-full text-xs border border-black" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {[
                { label: "EXONERADO", value: invoice.exonerado },
                { label: "DESCUENTO", value: invoice.descuento },
                { label: "GRAVADO 15%", value: invoice.gravado15, bold: true },
                { label: "GRAVADO 18%", value: invoice.gravado18 },
                { label: "ISV 15%", value: invoice.isv15 },
                { label: "ISV 18%", value: invoice.isv18 },
                { label: "EXENTAS:", value: invoice.exento },
              ].map((row) => (
                <tr key={row.label} className={row.bold ? "font-bold" : ""}>
                  <td className="border border-black px-2 py-0.5">{row.label}</td>
                  <td className="border border-black px-2 py-0.5 text-right">{formatLps(row.value)}</td>
                </tr>
              ))}
              <tr className="font-bold text-sm">
                <td className="border border-black px-2 py-1">TOTAL LPS.</td>
                <td className="border border-black px-2 py-1 text-right">{formatLps(invoice.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección 7 — Valor en Letras */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold whitespace-nowrap">Valor en Letras:</span>
        <div className="flex-1 bg-black text-white text-xs font-medium px-3 py-1.5">
          {numeroALetras(invoice.total)}
        </div>
      </div>
      <div className="text-center text-xs italic mb-4">
        La Factura es Beneficio de todos &quot;EXIJALA&quot;
      </div>

      {/* Sección 8 — Footer */}
      <div className="flex justify-end mb-4">
        <div className="w-40 text-center">
          <div className="border-b border-black mb-1" style={{ height: "32px" }}></div>
          <div className="text-xs font-bold">FIRMA</div>
        </div>
      </div>
      <div className="grid grid-cols-3 text-center text-[10px] border-t border-black pt-1">
        <div>Original: Cliente</div>
        <div>Copia1: Contabilidad</div>
        <div>Copia 2: Obligado Tributario Emisor</div>
      </div>
    </div>
  );
}
