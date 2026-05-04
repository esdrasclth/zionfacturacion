"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient, updateClient, deleteClient } from "@/lib/actions/clients";

type Client = { id: string; nombre: string; rtn: string; direccion?: string | null; telefono?: string | null; email?: string | null };

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const data = {
      nombre: fd.get("nombre") as string,
      rtn: fd.get("rtn") as string,
      direccion: fd.get("direccion") as string,
      telefono: fd.get("telefono") as string,
      email: fd.get("email") as string,
    };

    const result = client
      ? await updateClient(client.id, data)
      : await createClient(data);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
    } else {
      router.push("/clients");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!client || !confirm("¿Eliminar este cliente?")) return;
    const result = await deleteClient(client.id);
    if (result.error) alert(result.error);
    else router.push("/clients");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" id="nombre" name="nombre" defaultValue={client?.nombre} required error={errors.nombre?.[0]} />
      <Input label="RTN" id="rtn" name="rtn" defaultValue={client?.rtn} required error={errors.rtn?.[0]} className="font-mono" />
      <Input label="Dirección" id="direccion" name="direccion" defaultValue={client?.direccion ?? ""} />
      <Input label="Teléfono" id="telefono" name="telefono" defaultValue={client?.telefono ?? ""} />
      <Input label="Correo electrónico" id="email" name="email" type="email" defaultValue={client?.email ?? ""} error={errors.email?.[0]} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Guardando..." : client ? "Actualizar" : "Crear Cliente"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/clients")}>Cancelar</Button>
        {client && (
          <Button type="button" variant="danger" onClick={handleDelete} className="ml-auto">Eliminar</Button>
        )}
      </div>
    </form>
  );
}
