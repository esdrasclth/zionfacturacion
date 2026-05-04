import { getClient } from "@/lib/actions/clients";
import { ClientForm } from "@/components/clients/client-form";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      <div className="bg-white rounded-lg border p-6 max-w-lg">
        <ClientForm client={client} />
      </div>
    </div>
  );
}
