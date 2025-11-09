import Link from 'next/link';
export default function Home() {
  return (
    <main className="container">
      <div className="panel">
        <h1>Performance Dashboard</h1>
        <p>Open the <Link href="/dashboard">Dashboard</Link> to see real-time charts.</p>
      </div>
    </main>
  );
}
