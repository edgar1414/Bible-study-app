import { PrayMethodFlow } from '../components/prayer/PrayMethodFlow';
import { PrayerHistory } from '../components/prayer/PrayerHistory';

export function PrayerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold gradient-text">PRAY</h1>
        <p className="text-sm text-apple-500 mt-1">
          A guided prayer to prepare your heart for Scripture.
        </p>
      </div>

      <PrayMethodFlow />

      <div className="border-t border-white/30 pt-6">
        <PrayerHistory />
      </div>
    </div>
  );
}
