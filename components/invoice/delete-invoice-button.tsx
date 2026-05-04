"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deleteInvoice } from "@/lib/actions/invoices";

export function DeleteInvoiceButton({ id, redirectTo, compact }: { id: string; redirectTo?: string; compact?: boolean }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await deleteInvoice(id);
    setShowModal(false);
    if (redirectTo) router.push(redirectTo);
    else router.refresh();
  }

  return (
    <>
      {compact ? (
        <button
          onClick={() => setShowModal(true)}
          className="text-xs font-medium text-red-600 border border-red-200 px-2.5 py-1 rounded hover:bg-red-50 transition-colors"
        >
          Eliminar
        </button>
      ) : (
        <Button variant="danger" size="md" onClick={() => setShowModal(true)}>
          Eliminar
        </Button>
      )}

      {showModal && (
        <ConfirmModal
          title="Eliminar factura"
          description="Esta acción no se puede deshacer. La factura será eliminada permanentemente."
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}
