import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Brain } from 'lucide-react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setQuestions([]);
    setSubmitted(false);
    setAnswers([]);
    
    const generated = await generateQuizQuestions(topic);
    setQuestions(generated);
    setAnswers(new Array(generated.length).fill(-1));
    setLoading(false);
  };

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) s++;
    });
    setScore(s);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
          <div className="flex items-center space-x-2 text-indigo-900">
            <Brain className="w-6 h-6" />
            <h2 className="text-lg font-bold">AI Quiz Generator</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-indigo-100 rounded-full"><X className="w-6 h-6 text-gray-600" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {questions.length === 0 ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Enter a topic to generate a quiz:</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, World War II, Calculus Limits"
                  className="flex-1 border p-2 rounded-lg"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !topic}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                  Generate
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {submitted && (
                <div className={`p-4 rounded-lg text-center font-bold ${score / questions.length > 0.6 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  You scored {score} out of {questions.length}!
                </div>
              )}
              
              {questions.map((q, idx) => (
                <div key={idx} className="border p-4 rounded-lg shadow-sm">
                  <p className="font-medium text-lg mb-3">{idx + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = "w-full text-left p-3 rounded-md border transition-colors ";
                      if (submitted) {
                         if (optIdx === q.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800";
                         else if (answers[idx] === optIdx) btnClass += "bg-red-100 border-red-500 text-red-800";
                         else btnClass += "border-gray-200 opacity-50";
                      } else {
                        btnClass += answers[idx] === optIdx ? "bg-indigo-50 border-indigo-500" : "hover:bg-gray-50 border-gray-200";
                      }

                      return (
                        <button 
                          key={optIdx}
                          onClick={() => handleAnswer(idx, optIdx)}
                          className={btnClass}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {questions.length > 0 && !submitted && (
          <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
             <button 
               onClick={handleSubmit}
               className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
             >
               Submit Quiz
             </button>
          </div>
        )}
         {questions.length > 0 && submitted && (
          <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
             <button 
               onClick={() => setQuestions([])}
               className="text-indigo-600 font-medium hover:underline"
             >
               Start New Quiz
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
