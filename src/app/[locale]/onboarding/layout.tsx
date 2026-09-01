export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-5">
      {children}
    </div>
  );
}
