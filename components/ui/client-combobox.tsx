"use client";
import { useState, useRef, useEffect } from "react";

type Client = { id: string; nombre: string; rtn: string };

export function ClientCombobox({
  clients, error, defaultClient, autoFocus, nextRef,
}: {
  clients: Client[];
  error?: string;
  defaultClient?: Client;
  autoFocus?: boolean;
  nextRef?: React.RefObject<HTMLElement | null>;
}) {
  const [query, setQuery] = useState(defaultClient?.nombre ?? "");
  const [selectedId, setSelectedId] = useState(defaultClient?.id ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedIdRef = useRef(defaultClient?.id ?? "");

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const filtered = query.trim()
    ? clients.filter(
        (c) =>
          c.nombre.toLowerCase().includes(query.toLowerCase()) ||
          c.rtn.toLowerCase().includes(query.toLowerCase())
      )
    : clients;

  function select(client: Client) {
    selectedIdRef.current = client.id;
    setSelectedId(client.id);
    setQuery(client.nombre);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && !e.shiftKey && open && filtered.length > 0) {
      select(filtered[0]);
      if (nextRef?.current) {
        e.preventDefault();
        nextRef.current.focus();
      }
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      if (!selectedIdRef.current) setQuery("");
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1" onBlur={handleBlur}>
      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">Cliente *</label>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setSelectedId(""); selectedIdRef.current = ""; setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar cliente por nombre o RTN..."
        autoComplete="off"
        className={`border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      <input type="hidden" name="clientId" value={selectedId} />

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-y-auto">
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={() => select(c)}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 flex flex-col"
              >
                <span className="font-medium text-gray-900">{c.nombre}</span>
                <span className="text-xs text-gray-500 font-mono">{c.rtn}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg px-3 py-3 text-sm text-gray-400">
          No se encontró ningún cliente
        </div>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
