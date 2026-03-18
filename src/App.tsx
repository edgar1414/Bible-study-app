import { BrowserRouter, Routes, Route } from 'react-router';
import { TabBar } from './components/ui/TabBar';
import { StudyTimer } from './components/tracking/StudyTimer';
import { ScripturePage } from './pages/ScripturePage';
import { PrayerPage } from './pages/PrayerPage';
import { JournalPage } from './pages/JournalPage';
import { InsightsPage } from './pages/InsightsPage';
import { CollectionPage } from './pages/CollectionPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-dvh">
        <StudyTimer />

        <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6 pb-24">
          <Routes>
            <Route path="/" element={<ScripturePage />} />
            <Route path="/pray" element={<PrayerPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
        </main>

        <TabBar />
      </div>
    </BrowserRouter>
  );
}
