'use client'

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import Layout from './components/Layout';
import TemperatureChart from './components/TemperatureChart';
import TemperatureTable from './components/TemperatureTable';

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  return (
    <Layout 
      onDateRangeChange={handleDateRangeChange} 
      dateRange={dateRange}
    >
      <div className="space-y-8">
        <TemperatureChart dateRange={dateRange} />
        <TemperatureTable dateRange={dateRange} />
      </div>
    </Layout>
  );
}

