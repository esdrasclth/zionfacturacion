import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-xl"
               style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">ZION STUDIOS</h1>
          <p className="text-sm text-indigo-300 mt-1">Sistema de Facturación</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 ring-1 ring-white/10">
          <h2 className="text-base font-bold text-slate-900 mb-1">Bienvenido de nuevo</h2>
          <p className="text-sm text-slate-500 mb-6">Ingresa tus credenciales para continuar</p>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-indigo-300/60 mt-6">
          © 2026 Zion Studios. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
