export const metadata = {
  title: "Performance Dashboard",
  description: "Real-time data visualization at 60fps"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
