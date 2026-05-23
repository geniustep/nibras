export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-[#0E2250] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">مدارس النبراس</p>
            <p className="mt-1 text-sm text-slate-300">
              منصة التسجيل الأولي — نرافقكم بكل عناية في خطوات الانضمام.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Nibras Admission Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
