import { Chat } from '@/components/ui/Chat';

export const metadata = {
  title: 'FAQ Assistant',
  description: 'Get answers to your questions about our services',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h1>
      
      <p className="text-center mb-8 max-w-2xl mx-auto">
        Have questions about our services? Get instant answers using our AI-powered assistant below,
        or browse through our FAQ content.
      </p>
      
      <Chat />
    </div>
  );
} 