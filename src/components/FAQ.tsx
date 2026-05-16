import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Do I need a doctor's referral?",
    answer: "No, you do not need a referral to see a physiotherapist. You can book an appointment directly with us."
  },
  {
    question: "What should I wear to my first session?",
    answer: "Please wear comfortable, loose-fitting clothing. If you are experiencing lower body pain, bringing shorts is recommended."
  },
  {
    question: "Do you accept insurance?",
    answer: "We provide detailed invoices that you can submit to your insurance provider for reimbursement. Please check with your specific provider regarding your coverage."
  },
  {
    question: "How long is each session?",
    answer: "Initial assessments typically last 60 minutes to ensure a thorough evaluation. Follow-up treatment sessions are usually 45 minutes."
  }
];

export default function FAQ() {
  // Sets the first question to be open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6">
      <h2 className="mb-8 text-center font-display text-3xl font-bold text-teal-900">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all hover:border-teal-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left font-semibold text-gray-800 focus:outline-none"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-teal-600 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-2 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}