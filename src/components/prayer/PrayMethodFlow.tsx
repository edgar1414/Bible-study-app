import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { usePrayer } from '../../hooks/usePrayer';
import { Check } from 'lucide-react';

const STEPS = [
  {
    letter: 'P',
    title: 'Praise',
    subtitle: 'Thank God and articulate who He is',
    prompt: 'Begin by acknowledging God\'s character. What attributes of God are you grateful for today? Speak your praise freely.',
    field: 'praise' as const,
  },
  {
    letter: 'R',
    title: 'Repent',
    subtitle: 'Confess and acknowledge conviction',
    prompt: 'Is there anything weighing on your heart? Bring it before God with honesty. He already knows — and He is faithful to forgive.',
    field: 'repent' as const,
  },
  {
    letter: 'A',
    title: 'Ask',
    subtitle: 'Bring your needs and requests',
    prompt: 'What do you need from God right now? Lay your requests before Him — for yourself, your loved ones, and the world around you.',
    field: 'ask' as const,
  },
  {
    letter: 'Y',
    title: 'Yield',
    subtitle: 'Quiet reflection — listen',
    prompt: 'Be still. Surrender your agenda. What is God speaking to you in this moment? Write down anything you sense.',
    field: 'yield' as const,
  },
];

export function PrayMethodFlow() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ praise: '', repent: '', ask: '', yield: '' });
  const [saved, setSaved] = useState(false);
  const { addEntry } = usePrayer();

  const current = STEPS[step];

  const handleSave = async () => {
    await addEntry({
      date: new Date().toISOString().split('T')[0],
      ...values,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setStep(0);
      setValues({ praise: '', repent: '', ask: '', yield: '' });
    }, 2000);
  };

  if (saved) {
    return (
      <GlassCard className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-apple-900">Prayer Saved</h3>
          <p className="text-sm text-apple-500 mt-1">Your prayer has been recorded.</p>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.letter}
            onClick={() => setStep(i)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-all ${
              i === step ? 'text-white shadow-lg' : i < step ? 'glass text-accent' : 'glass text-apple-400'
            }`}
            style={i === step ? { background: '#007AFF' } : undefined}
          >
            <span className="text-lg font-bold">{s.letter}</span>
            <span className="text-[10px] font-medium">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard>
            <h3 className="text-xl font-semibold text-apple-900 mb-1">
              {current.title}
            </h3>
            <p className="text-sm text-apple-500 mb-4">{current.subtitle}</p>
            <p className="text-sm text-apple-600 italic mb-4 leading-relaxed">
              {current.prompt}
            </p>
            <TextArea
              value={values[current.field]}
              onChange={e => setValues(prev => ({ ...prev, [current.field]: e.target.value }))}
              placeholder="Write or speak your thoughts here..."
              rows={6}
              enableVoice
              onVoiceResult={(transcript) =>
                setValues(prev => ({
                  ...prev,
                  [current.field]: prev[current.field]
                    ? prev[current.field] + ' ' + transcript
                    : transcript,
                }))
              }
            />
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className={step === 0 ? 'opacity-0 pointer-events-none' : ''}
        >
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSave}>
            Save Prayer
          </Button>
        )}
      </div>
    </div>
  );
}
