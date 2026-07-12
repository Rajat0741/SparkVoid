export default function StandardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-12 h-full">
      {children}
    </div>
  );
}
