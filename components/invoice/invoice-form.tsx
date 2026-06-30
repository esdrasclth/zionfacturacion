"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientCombobox } from "@/components/ui/client-combobox";
import { createInvoice, updateInvoice } from "@/lib/actions/invoices";
import { TIPOS_PAGO, type TipoPago } from "@/lib/validations/invoice";
import { formatLps } from "@/lib/format";

type Client = { id: string; nombre: string; rtn: string };

type ItemRow = {
  id: string; quantity: string; description: string;
  unitPrice: string; discount: string; isvRate: string;
};

type ExistingInvoice = {
  id: string;
  clientId: string;
  client: { nombre: string; rtn: string };
  issueDate: Date;
  ordenCompraExenta?: string | null;
  regExonerados?: string | null;
  regSag?: string | null;
  carnetDiplomatico: string | null;
  exportacionCA: boolean;
  tipoPago: string;
  exportacionFueraCA: boolean;
  items: { quantity: number; description: string; unitPrice: number; discount: number; isvRate: number; order: number }[];
};

function newRow(): ItemRow {
  return { id: crypto.randomUUID(), quantity: "1", description: "", unitPrice: "0", discount: "0", isvRate: "15" };
}

function calcItemTotal(row: ItemRow) {
  return (parseFloat(row.quantity) || 0) * (parseFloat(row.unitPrice) || 0) - (parseFloat(row.discount) || 0);
}

function calcTotals(rows: ItemRow[]) {
  let gravado15 = 0, gravado18 = 0, exento = 0, descuento = 0;
  for (const row of rows) {
    const net = (parseFloat(row.quantity) || 0) * (parseFloat(row.unitPrice) || 0) - (parseFloat(row.discount) || 0);
    descuento += parseFloat(row.discount) || 0;
    if (row.isvRate === "15") gravado15 += net;
    else if (row.isvRate === "18") gravado18 += net;
    else exento += net;
  }
  const isv15 = gravado15 * 0.15;
  const isv18 = gravado18 * 0.18;
  return { gravado15, gravado18, isv15, isv18, exento, descuento, total: gravado15 + gravado18 + isv15 + isv18 + exento };
}

export function InvoiceForm({ clients, invoice }: { clients: Client[]; invoice?: ExistingInvoice }) {
  const router = useRouter();
  const isEditing = !!invoice;

  const [rows, setRows] = useState<ItemRow[]>(
    invoice?.items.length
      ? invoice.items.map((item) => ({
          id: crypto.randomUUID(),
          quantity: String(item.quantity),
          description: item.description,
          unitPrice: String(item.unitPrice),
          discount: String(item.discount),
          isvRate: String(item.isvRate),
        }))
      : [newRow()]
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

  const dateRef = useRef<HTMLInputElement>(null);
  const tipoPagoRef = useRef<HTMLSelectElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const addRowBtnRef = useRef<HTMLButtonElement>(null);
  const descRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const priceRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const discountRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const today = new Date().toISOString().split("T")[0];
  const defaultDate = invoice ? new Date(invoice.issueDate).toISOString().split("T")[0] : today;
  const totals = calcTotals(rows);

  // Focus new row's description after state update
  useEffect(() => {
    if (pendingFocusId) {
      descRefs.current.get(pendingFocusId)?.focus();
      setPendingFocusId(null);
    }
  }, [pendingFocusId, rows]);

  function updateRow(id: string, field: keyof ItemRow, value: string) {
    setRows((r) => r.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  const addRow = useCallback(() => {
    const row = newRow();
    setRows((r) => [...r, row]);
    setPendingFocusId(row.id);
    return row.id;
  }, []);

  function handleDateKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      tipoPagoRef.current?.focus();
    }
  }

  function handleTipoPagoKeyDown(e: React.KeyboardEvent<HTMLSelectElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const firstId = rows[0]?.id;
      if (firstId) descRefs.current.get(firstId)?.focus();
    }
  }

  function handleDiscountKeyDown(e: React.KeyboardEvent<HTMLInputElement>, rowId: string) {
    const isLast = rows[rows.length - 1].id === rowId;
    if (e.key === "Tab" && !e.shiftKey && isLast) {
      e.preventDefault();
      addRowBtnRef.current?.focus();
    }
  }

  function handleAddRowKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      submitRef.current?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const fd = new FormData(e.currentTarget);

    const data = {
      clientId: fd.get("clientId") as string,
      issueDate: fd.get("issueDate") as string,
      tipoPago: (fd.get("tipoPago") as TipoPago) ?? "CREDITO",
      ordenCompraExenta: fd.get("ordenCompraExenta") as string,
      regExonerados: fd.get("regExonerados") as string,
      regSag: fd.get("regSag") as string,
      carnetDiplomatico: fd.get("carnetDiplomatico") as string,
      exportacionCA: fd.get("exportacionCA") === "on",
      exportacionFueraCA: fd.get("exportacionFueraCA") === "on",
      items: rows.map((row, i) => ({
        quantity: parseFloat(row.quantity) || 0,
        description: row.description,
        unitPrice: parseFloat(row.unitPrice) || 0,
        discount: parseFloat(row.discount) || 0,
        isvRate: parseFloat(row.isvRate) || 15,
        order: i,
      })),
    };

    const result = isEditing
      ? await updateInvoice(invoice.id, data)
      : await createInvoice(data);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
      setSaving(false);
    } else if (result.invoice) {
      router.push(`/invoices/${result.invoice.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ClientCombobox
          clients={clients}
          error={errors.clientId?.[0]}
          defaultClient={invoice ? { id: invoice.clientId, nombre: invoice.client.nombre, rtn: invoice.client.rtn } : undefined}
          autoFocus={!isEditing}
          nextRef={dateRef as React.RefObject<HTMLElement>}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="issueDate" className="text-xs font-medium text-gray-700 uppercase tracking-wide">Fecha de emisión *</label>
          <input
            ref={dateRef}
            id="issueDate"
            name="issueDate"
            type="date"
            defaultValue={defaultDate}
            required
            onKeyDown={handleDateKeyDown}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Tipo de Pago *</label>
          <select
            ref={tipoPagoRef}
            name="tipoPago"
            defaultValue={invoice?.tipoPago ?? "CREDITO"}
            onKeyDown={handleTipoPagoKeyDown}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {TIPOS_PAGO.map((t) => (
              <option key={t} value={t}>
                {t === "CONTADO" ? "Al Contado" : t === "CREDITO" ? "Crédito" : t === "TRANSFERENCIA" ? "Transferencia" : "Cheque"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Exoneración (opcional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input label="No. Orden Compra Exenta" id="ordenCompraExenta" name="ordenCompraExenta" defaultValue={invoice?.ordenCompraExenta ?? ""} tabIndex={-1} />
          <Input label="No. Reg. Exonerados" id="regExonerados" name="regExonerados" defaultValue={invoice?.regExonerados ?? ""} tabIndex={-1} />
          <Input label="No. Reg. SAG" id="regSag" name="regSag" defaultValue={invoice?.regSag ?? ""} tabIndex={-1} />
          <Input label="Carnet Diplomático" id="carnetDiplomatico" name="carnetDiplomatico" defaultValue={invoice?.carnetDiplomatico ?? ""} tabIndex={-1} />
          {[
            { name: "exportacionCA", label: "Exportación C.A.", checked: invoice?.exportacionCA },
            { name: "exportacionFueraCA", label: "Exportación fuera C.A.", checked: invoice?.exportacionFueraCA },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">{item.label}</label>
              <label className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                <input type="checkbox" name={item.name} defaultChecked={item.checked ?? false} tabIndex={-1} className="rounded" />
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Ítems / Servicios</h3>
        {errors.items && <p className="text-xs text-red-600 mb-2">{errors.items[0]}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded min-w-[640px]">
            <thead className="bg-gray-900 text-white text-xs">
              <tr>
                <th className="px-3 py-2 text-left w-16">Cant.</th>
                <th className="px-3 py-2 text-left">Descripción</th>
                <th className="px-3 py-2 text-right w-28">Precio Unit.</th>
                <th className="px-3 py-2 text-right w-24">Descuento</th>
                <th className="px-3 py-2 text-center w-20">ISV %</th>
                <th className="px-3 py-2 text-right w-28">Total</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1">
                    <input
                      type="number" step="0.01" min="0" value={row.quantity}
                      onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                      tabIndex={-1}
                      className="w-full border-0 bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-black rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => updateRow(row.id, "description", e.target.value)}
                      placeholder="Descripción del servicio..."
                      ref={(el) => { if (el) descRefs.current.set(row.id, el); else descRefs.current.delete(row.id); }}
                      className="w-full border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-black rounded px-1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number" step="0.01" min="0" value={row.unitPrice}
                      onChange={(e) => updateRow(row.id, "unitPrice", e.target.value)}
                      ref={(el) => { if (el) priceRefs.current.set(row.id, el); else priceRefs.current.delete(row.id); }}
                      className="w-full border-0 bg-transparent text-right focus:outline-none focus:ring-1 focus:ring-black rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number" step="0.01" min="0" value={row.discount}
                      onChange={(e) => updateRow(row.id, "discount", e.target.value)}
                      ref={(el) => { if (el) discountRefs.current.set(row.id, el); else discountRefs.current.delete(row.id); }}
                      onKeyDown={(e) => handleDiscountKeyDown(e, row.id)}
                      className="w-full border-0 bg-transparent text-right focus:outline-none focus:ring-1 focus:ring-black rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <select
                      value={row.isvRate}
                      onChange={(e) => updateRow(row.id, "isvRate", e.target.value)}
                      tabIndex={-1}
                      className="w-full border-0 bg-transparent text-center focus:outline-none"
                    >
                      <option value="0">0%</option>
                      <option value="15">15%</option>
                      <option value="18">18%</option>
                    </select>
                  </td>
                  <td className="px-2 py-1 text-right font-medium">{formatLps(calcItemTotal(row))}</td>
                  <td className="px-1 py-1">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => rows.length > 1 && setRows((r) => r.filter((x) => x.id !== row.id))}
                      className="text-red-400 hover:text-red-600 text-lg leading-none"
                    >×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button ref={addRowBtnRef} type="button" variant="ghost" size="sm" onClick={addRow} onKeyDown={handleAddRowKeyDown} className="mt-2">
          + Agregar ítem
        </Button>
      </div>

      <div className="flex justify-end">
        <div className="w-64 text-sm space-y-1 border rounded p-4 bg-gray-50">
          <div className="flex justify-between"><span className="text-gray-600">Gravado 15%</span><span>{formatLps(totals.gravado15)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Gravado 18%</span><span>{formatLps(totals.gravado18)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">ISV 15%</span><span>{formatLps(totals.isv15)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">ISV 18%</span><span>{formatLps(totals.isv18)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Exentas</span><span>{formatLps(totals.exento)}</span></div>
          <div className="border-t pt-1 flex justify-between font-bold text-base">
            <span>TOTAL LPS.</span><span>{formatLps(totals.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button ref={submitRef} type="submit" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Factura"}
        </Button>
        <Button type="button" variant="secondary" tabIndex={-1} onClick={() => router.push(isEditing ? `/invoices/${invoice.id}` : "/invoices")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
