import React, { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, KeyRound, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciais inválidas. Verifique o e-mail e a senha.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-3 group">
          <img src="/Logo Mega.png" alt="Mega Marketing" className="w-28 h-28 object-contain scale-140 group-hover:scale-150 transition-transform drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]" />
        </Link>
        <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-slate-200">
          Acesso Operacional
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Painel de controle para franqueados e supervisores
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 blur-xl rounded-[2rem]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-slate-900 border border-slate-800 py-10 px-4 shadow-2xl sm:rounded-[2rem] sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-300 mb-2">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 bg-slate-950 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 bg-slate-950 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-600 focus:ring-offset-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm leading-6">
                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-500 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
