"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { upsertCompany } from "@/lib/actions/settings";
import type { SettingsInput } from "@/lib/validations/settings";

type Company = {
  name: string; legalName: string; rtn: string; address: string;
  phone: string; celular: string; email: string; cai: string; rangoDesde: string;
  rangoHasta: string; fechaRecepcion: Date; fechaLimiteEmision: Date;
} | null;

export function SettingsForm({ company }: { company: Company }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function toDateInput(d: Date) {
    return d.toISOString().split("T")[0];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    const data: SettingsInput = {
      name: fd.get("name") as string,
      legalName: fd.get("legalName") as string,
      rtn: fd.get("rtn") as string,
      address: fd.get("address") as string,
      phone: fd.get("phone") as string,
      celular: fd.get("celular") as string,
      email: fd.get("email") as string,
      cai: fd.get("cai") as string,
      rangoDesde: fd.get("rangoDesde") as string,
      rangoHasta: fd.get("rangoHasta") as string,
      fechaRecepcion: fd.get("fechaRecepcion") as string,
      fechaLimiteEmision: fd.get("fechaLimiteEmision") as string,
    };
    const result = await upsertCompany(data);
    if (!result.error) setSuccess(true);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Información de la Empresa</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre de exhibición" id="name" name="name" defaultValue={company?.name} required />
          <Input label="Nombre legal" id="legalName" name="legalName" defaultValue={company?.legalName} required />
          <Input label="RTN" id="rtn" name="rtn" defaultValue={company?.rtn} required />
          <Input label="Teléfono" id="phone" name="phone" defaultValue={company?.phone} required />
          <Input label="Celular" id="celular" name="celular" defaultValue={company?.celular} />
          <Input label="Correo" id="email" name="email" type="email" defaultValue={company?.email} required />
          <div className="col-span-2">
            <Input label="Dirección" id="address" name="address" defaultValue={company?.address} required />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Datos Fiscales (CAI)</h3>
        <div className="space-y-4">
          <Input label="CAI" id="cai" name="cai" defaultValue={company?.cai} required className="font-mono" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Rango Desde" id="rangoDesde" name="rangoDesde" defaultValue={company?.rangoDesde} required className="font-mono" />
            <Input label="Rango Hasta" id="rangoHasta" name="rangoHasta" defaultValue={company?.rangoHasta} required className="font-mono" />
            <Input label="Fecha Recepción" id="fechaRecepcion" name="fechaRecepcion" type="date" defaultValue={company ? toDateInput(company.fechaRecepcion) : ""} required />
            <Input label="Fecha Límite Emisión" id="fechaLimiteEmision" name="fechaLimiteEmision" type="date" defaultValue={company ? toDateInput(company.fechaLimiteEmision) : ""} required />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
        {success && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>
            Guardado correctamente
          </span>
        )}
      </div>
    </form>
  );
}
