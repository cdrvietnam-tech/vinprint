"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import "./admin-shell.css";
import { ChevronLeft, ChevronRight, Menu, Search, X, Moon, Sun, RefreshCw, ArrowUpRight } from "lucide-react";
import {
  ADMIN_NAV_GROUPS, filterAdminNav, getAdminPageTitle,
  type AdminKey, type AdminNavItem,
} from "./admin-nav";

async function serviceStatus(){
  try{
    const results=await Promise.all([fetch("/api/site-content",{cache:"no-store"}),fetch("/api/media/collections?collection=hot-products",{cache:"no-store"})]);
    return results.every(r=>r.ok)?"Dữ liệu sẵn sàng":"Cần kiểm tra kết nối";
  }catch{return "Chưa kết nối dữ liệu";}
}

function NavLink({ item, active, collapsed, onNavigate }: { item: AdminNavItem; active: boolean; collapsed: boolean; onNavigate?: () => void }) {
  const className = `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors ${
    active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  } ${collapsed ? "justify-center" : ""}`;
  const content = (
    <>
      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {collapsed ? <span className="sr-only">{item.title}</span> : <span className="truncate">{item.title}</span>}
      {!collapsed && item.external ? <span className="ml-auto text-xs font-black opacity-60" aria-hidden="true">↗</span> : null}
    </>
  );

  if (item.external && !item.href.startsWith("/")) {
    return <a href={item.href} target="_blank" rel="noreferrer" title={item.title} className={className} onClick={onNavigate}>{content}</a>;
  }
  if (item.external) {
    return <Link href={item.href} target="_blank" title={item.title} className={className} onClick={onNavigate}>{content}</Link>;
  }
  return <Link href={item.href} title={item.title} aria-current={active ? "page" : undefined} className={className} onClick={onNavigate}>{content}</Link>;
}

function Sidebar({ active, collapsed, onNavigate }: { active: AdminKey; collapsed: boolean; onNavigate?: () => void }) {
  const [query,setQuery]=useState("");
  const matching=new Set(filterAdminNav(query).map(item=>item.id));
  return (
    <nav aria-label="Điều hướng quản trị" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {!collapsed&&<label className="admin-menu-filter"><Search size={15}/><input aria-label="Lọc menu quản trị" placeholder="Lọc menu…" value={query} onChange={e=>setQuery(e.target.value)}/></label>}
      {ADMIN_NAV_GROUPS.filter(group=>group.items.some(item=>matching.has(item.id))).map((group) => (
        <div key={group.group}>
          {collapsed
            ? <div className="mx-2 mb-2 border-t border-gray-200" />
            : <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">{group.group}</p>}
          <ul className="space-y-1">
            {group.items.filter(item=>matching.has(item.id)).map((item) => (
              <li key={item.id}><NavLink item={item} active={item.id === active} collapsed={collapsed} onNavigate={onNavigate} /></li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className="flex min-h-11 items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-black text-white">V</span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-black text-gray-950">VinPrint</span>
          <span className="block truncate text-[11px] font-bold text-gray-500">Admin workspace</span>
        </span>
      )}
    </Link>
  );
}

function CommandDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = filterAdminNav(query);
  const selected = Math.min(cursor, Math.max(results.length - 1, 0));

  useEffect(() => { inputRef.current?.focus(); }, []);

  const go = (item: AdminNavItem | undefined) => {
    if (!item) return;
    onClose();
    if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else window.location.assign(item.href);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 pt-[12vh]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Tìm nhanh trong quản trị" className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-gray-200 px-4">
          <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setCursor(0); }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") { event.preventDefault(); setCursor(Math.min(selected + 1, results.length - 1)); }
              else if (event.key === "ArrowUp") { event.preventDefault(); setCursor(Math.max(selected - 1, 0)); }
              else if (event.key === "Enter") { event.preventDefault(); go(results[selected]); }
              else if (event.key === "Escape") { event.preventDefault(); onClose(); }
            }}
            placeholder="Tìm khu vực quản trị…"
            aria-label="Tìm khu vực quản trị"
            className="min-h-14 flex-1 bg-transparent text-base font-medium text-gray-950 outline-none placeholder:text-gray-400"
          />
          <kbd className="rounded-md border border-gray-200 px-2 py-1 text-[11px] font-bold text-gray-500">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm font-medium text-gray-500">Không tìm thấy mục phù hợp.</li>}
          {results.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setCursor(index)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold ${index === selected ? "bg-blue-50 text-blue-700" : "text-gray-800"}`}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate">{item.pageTitle}</span>
                {item.external ? <span className="text-xs font-black opacity-60" aria-hidden="true">↗</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AdminShell({ active, children }: { active: AdminKey; children: React.ReactNode }) {
  const router=useRouter();
  const [dark,setDark]=useState(false);
  const [service,setService]=useState("Đang kiểm tra…");
  const [refreshing,setRefreshing]=useState(true);
  function checkService(){return serviceStatus().then(setService).finally(()=>setRefreshing(false));}
  useEffect(()=>{let mounted=true;serviceStatus().then(value=>{if(mounted){setService(value);setRefreshing(false);}});return ()=>{mounted=false;};},[]);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div data-theme={dark?"dark":"light"} className="vinprint-admin flex min-h-screen bg-slate-50 text-slate-900">
      {commandOpen && <CommandDialog onClose={() => setCommandOpen(false)} />}

      {/* Sidebar máy tính */}
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-200 lg:flex ${collapsed ? "w-20" : "w-64"}`}>
        <div className={`flex h-16 items-center border-b border-gray-200 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          <Brand collapsed={collapsed} />
          {!collapsed && (
            <button type="button" onClick={() => setCollapsed(true)} aria-label="Thu gọn menu" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
        <Sidebar active={active} collapsed={collapsed} />
        {collapsed && (
          <div className="border-t border-gray-200 p-3">
            <button type="button" onClick={() => setCollapsed(false)} aria-label="Mở rộng menu" className="flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Menu trượt trên điện thoại */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" aria-label="Đóng menu" className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <Brand collapsed={false} />
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Đóng menu" className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar active={active} collapsed={false} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Mở menu" className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-700 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 truncate text-sm"><span className="hidden text-slate-400 xl:inline">Quản trị <span className="mx-2">/</span></span><span className="font-semibold">{getAdminPageTitle(active)}</span></div>
          <button type="button" onClick={() => setCommandOpen(true)} className="flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 text-sm font-bold text-gray-600 hover:border-blue-300 hover:text-blue-700">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Tìm nhanh</span>
            <kbd className="hidden rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-bold text-gray-500 sm:inline">Ctrl K</kbd>
          </button>
          <span className="admin-service hidden items-center gap-2 text-xs text-slate-500 xl:flex"><span className={service==="Dữ liệu sẵn sàng"?"bg-emerald-500":"bg-amber-500"}/>{service}</span>
          <button type="button" aria-label="Làm mới dữ liệu" disabled={refreshing} onClick={()=>{setRefreshing(true);void checkService();router.refresh();}} className="admin-icon-button"><RefreshCw size={17} className={refreshing?"animate-spin":""}/></button>
          <button type="button" aria-label={dark?"Chuyển giao diện sáng":"Chuyển giao diện tối"} onClick={()=>setDark(value=>!value)} className="admin-icon-button">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
          <Link href="/" target="_blank" className="hidden min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium sm:inline-flex">Xem web <ArrowUpRight size={15}/></Link>
        </header>
        <div className="admin-workspace min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
