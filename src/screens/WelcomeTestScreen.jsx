import React, { useState } from 'react';
import { useAppStore } from '../store';

export default function WelcomeTestScreen({ t }) {
  const questions = useAppStore((s) => s.welcomeQuestions);
  const passWelcomeTest = useAppStore((s) => s.passWelcomeTest);
  const failWelcomeTest = useAppStore((s) => s.failWelcomeTest);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);

  const q = questions[step];

  const handleNext = () => {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    if (!correct) {
      failWelcomeTest();
      return;
    }
    if (step + 1 >= questions.length) {
      passWelcomeTest();
    } else {
      setStep(step + 1);
      setSelected(null);
    }
  };

  if (!q) return null;

  return (
    <div className="fade-in mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 pb-10">
      <p className="mb-1 text-center text-xs font-bold text-muted">
        اختبار الترحيب — سؤال {step + 1} من {questions.length}
      </p>
      <h1 className="mb-6 text-center text-xl font-black">{q.question}</h1>

      <div className="space-y-3">
        {q.answers.map((a, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full rounded-2xl border p-4 text-right text-sm font-bold transition ${
              selected === i ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-200 bg-white'
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selected === null}
        className="mt-6 rounded-2xl bg-primary py-3.5 font-bold text-white shadow-soft transition active:scale-[0.98] disabled:opacity-50"
      >
        {step + 1 >= questions.length ? 'إنهاء الاختبار' : 'التالي'}
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        هذا الاختبار يساعدنا نحافظ على جودة التطبيق ونمنع سوء الاستخدام.
      </p>
    </div>
  );
}
