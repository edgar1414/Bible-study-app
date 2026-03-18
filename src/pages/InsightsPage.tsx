import { CalendarHeatMap } from '../components/calendar/CalendarHeatMap';
import { TimePatterns } from '../components/tracking/TimePatterns';
import { MoodPatterns } from '../components/tracking/MoodPatterns';
import { WeeklyPrompt } from '../components/reflection/WeeklyPrompt';

export function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Insights</h1>
        <p className="text-sm text-apple-500 mt-1">
          See how your practice is shaping you.
        </p>
      </div>

      <WeeklyPrompt />
      <CalendarHeatMap />
      <TimePatterns />
      <MoodPatterns />
    </div>
  );
}
