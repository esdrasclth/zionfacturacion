import { ClientForm } from "@/components/clients/client-form";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h1>
        <p className="text-sm text-gray-500 mt-1">Registra un nuevo cliente en el sistema</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-lg">
        <ClientForm />
      </div>
    </div>
  );
}
