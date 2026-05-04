import { getCompany } from "@/lib/actions/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const company = await getCompany();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Datos de la empresa y configuración fiscal</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
        <SettingsForm company={company} />
      </div>
    </div>
  );
}
