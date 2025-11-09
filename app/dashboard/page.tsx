import { seedData } from '@/lib/dataGenerator';
import type { DataPoint } from '@/lib/types';
import DataProvider from '@/components/providers/DataProvider';
import FilterPanel from '@/components/controls/FilterPanel';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import Heatmap from '@/components/charts/Heatmap';
import DataTable from '@/components/ui/DataTable';
import '../globals.css';

async function generateInitialDataset(): Promise<DataPoint[]> {
  return seedData(4000);
}

export default async function DashboardPage() {
  const initialData = await generateInitialDataset();
  return (
    <DataProvider initialData={initialData}>
      <header className="header">
        <h1>⚡ Performance Dashboard</h1>
        <span className="small">Next.js App Router • Canvas+SVG-free (pure Canvas) • 60fps</span>
      </header>
      <PerformanceMonitor />
      <FilterPanel />
      <TimeRangeSelector />
      <section className="grid">
        <LineChart />
        <ScatterPlot />
        <BarChart />
        <Heatmap />
      </section>
      <section className="row">
        <DataTable />
      </section>
    </DataProvider>
  );
}
