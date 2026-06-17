import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Briefcase,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Map,
  Menu,
  X
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Campanhas', href: '/admin/campanhas', icon: MapPin },
  { name: 'Equipe', href: '/admin/equipe', icon: Users },
  { name: 'Configurar Mapa', href: '/admin/mapa', icon: Map },
  { name: 'Clientes', href: '/admin/clientes', icon: Briefcase },
  { name: 'Financeiro', href: '/admin/financeiro', icon: Wallet },
  { name: 'Relatórios', href: '/admin/relatorios', icon: FileText },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
];

const mockNotifications = [
  { id: 1, title: 'Operação Finalizada', description: 'Equipe Alfa concluiu a Rota 4 no Setor Bueno.', time: 'Há 15 min', read: false, type: 'success' },
  { id: 2, title: 'Alerta de Logística', description: 'Reposição de material necessária na base Sul.', time: 'Há 45 min', read: false, type: 'warning' },
  { id: 3, title: 'Auditoria Fotográfica', description: '120 novas fotos sincronizadas pela Equipe Beta.', time: 'Há 2 horas', read: true, type: 'info' }
];

export default function AdminLayout() {
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha o menu mobile sempre que a rota mudar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Overlay para Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="Mega Marketing" className="w-8 h-8 object-contain" />
            <span className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight leading-none">Mega</span>
              <span className="text-[9px] font-medium text-slate-400 tracking-widest uppercase leading-tight mt-0.5">marketing direto</span>
            </span>
          </Link>
          {/* Botão fechar — visível apenas no mobile */}
          <button
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                  isActive 
                    ? "bg-slate-800 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0 w-5 h-5",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 rounded-xl hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair do sistema
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Botão hambúrguer — visível apenas no mobile */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb — visível apenas no desktop */}
            <div className="hidden md:flex items-center text-sm font-medium text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer">Admin</span>
              <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
              <span className="text-slate-200">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar campanha..." 
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
              />
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                className="relative text-slate-400 hover:text-white transition-colors p-1"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-500 border-2 border-slate-900 rounded-full"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-left">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-slate-900/50">
                    <h3 className="font-semibold text-white">Notificações</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        onClick={markAllAsRead}
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="text-sm text-slate-500 p-6 text-center">Nenhuma notificação encontrada</div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={cn(
                            "px-4 py-3 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/50 transition-colors flex gap-3 items-start",
                            !notification.read ? "bg-slate-800/20" : ""
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 p-1.5 rounded-lg shrink-0",
                            notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                            notification.type === 'warning' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-indigo-500/10 text-indigo-400'
                          )}>
                            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                            {notification.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                            {notification.type === 'info' && <Bell className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-200">{notification.title}</div>
                            <div className="text-xs text-slate-400 mt-1">{notification.description}</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-2">{notification.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-700 pl-6 cursor-pointer">
              <img 
                src="https://i.pravatar.cc/150?img=11" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-slate-700"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-white leading-tight">Admin System</div>
                <div className="text-xs text-slate-400">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
