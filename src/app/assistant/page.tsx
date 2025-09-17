'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/Section';
import ClickSpark from '@/components/ClickSpark';
import FadeContent from '@/components/FadeContent';
import Counter from '@/components/Counter';
import { addBooking } from '@/lib/storage';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Choice {
  id: string;
  text: string;
  value: string | number;
}

interface ChatState {
  step: 'setup' | 'welcome' | 'date' | 'time' | 'people' | 'confirm' | 'complete' | 'custom-date' | 'custom-time' | 'custom-people';
  userData: {
    name: string;
    email: string;
    date: string;
    time: string;
    people: number;
  };
}

// Dynamic AI Assistant with chat interface
export default function AssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    step: 'setup',
    userData: {
      name: '',
      email: '',
      date: '',
      time: '',
      people: 2
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [setupForm, setSetupForm] = useState({ name: '', email: '' });
  const [showChoices, setShowChoices] = useState<Choice[]>([]);
  const [customInput, setCustomInput] = useState({ date: '', time: '', people: 2 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (content: string, type: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (duration: number = 1500) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(null);
      }, duration);
    });
  };

  const getDateChoices = (): Choice[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    return [
      { id: 'today', text: 'Today', value: today.toISOString().split('T')[0] },
      { id: 'tomorrow', text: 'Tomorrow', value: tomorrow.toISOString().split('T')[0] },
      { id: 'day-after', text: dayAfter.toLocaleDateString('en-US', { weekday: 'long' }), value: dayAfter.toISOString().split('T')[0] },
      { id: 'custom', text: 'Pick a different date', value: 'custom' }
    ];
  };

  const getTimeChoices = (): Choice[] => [
    { id: 'lunch', text: '12:00 PM (Lunch)', value: '12:00' },
    { id: 'afternoon', text: '2:00 PM (Afternoon)', value: '14:00' },
    { id: 'early-dinner', text: '6:00 PM (Early Dinner)', value: '18:00' },
    { id: 'dinner', text: '7:30 PM (Prime Time)', value: '19:30' },
    { id: 'late', text: '9:00 PM (Late Dining)', value: '21:00' },
    { id: 'custom', text: 'Choose different time', value: 'custom' }
  ];

  const getPeopleChoices = (): Choice[] => [
    { id: 'solo', text: 'Just me (1 person)', value: 1 },
    { id: 'couple', text: 'Date night (2 people)', value: 2 },
    { id: 'small', text: 'Small group (3-4 people)', value: 4 },
    { id: 'large', text: 'Large group (5+ people)', value: 6 },
    { id: 'custom', text: 'Different number', value: 'custom' }
  ];

  const handleStartChat = async () => {
    if (!setupForm.name.trim() || !setupForm.email.trim()) return;
    
    setChatState(prev => ({
      ...prev,
      step: 'welcome',
      userData: { ...prev.userData, name: setupForm.name, email: setupForm.email }
    }));

    await simulateTyping(800);
    addMessage(`Hi ${setupForm.name}! 👋 I&apos;m your AI reservation assistant. I&apos;ll help you book the perfect table in just a few quick steps.`, 'ai');
    
    await simulateTyping(1200);
    addMessage("Let me check our availability... 🔍", 'ai');
    
    await simulateTyping(2000);
    addMessage("Great news! We have several slots available. When would you like to dine with us?", 'ai');
    
    setChatState(prev => ({ ...prev, step: 'date' }));
    setShowChoices(getDateChoices());
  };

  const handleCustomSubmit = async (type: 'date' | 'time' | 'people') => {
    if (type === 'date' && customInput.date) {
      const selectedDate = new Date(customInput.date);
      const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      addMessage(`${dateStr}`, 'user');
      
      setChatState(prev => ({
        ...prev,
        userData: { ...prev.userData, date: customInput.date },
        step: 'time'
      }));

      await simulateTyping(1000);
      addMessage(`Perfect! ${dateStr} it is. Now, what time would you prefer?`, 'ai');
      setShowChoices(getTimeChoices());
      
    } else if (type === 'time' && customInput.time) {
      const timeStr = new Date(`2000-01-01T${customInput.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      addMessage(`${timeStr}`, 'user');
      
      setChatState(prev => ({
        ...prev,
        userData: { ...prev.userData, time: customInput.time },
        step: 'people'
      }));

      await simulateTyping(1200);
      addMessage(`Excellent choice! ${timeStr} is a great time. How many people will be joining you?`, 'ai');
      setShowChoices(getPeopleChoices());
      
    } else if (type === 'people' && customInput.people > 0) {
      addMessage(`${customInput.people} ${customInput.people === 1 ? 'person' : 'people'}`, 'user');
      
      setChatState(prev => ({
        ...prev,
        userData: { ...prev.userData, people: customInput.people },
        step: 'confirm'
      }));

      await simulateTyping(1500);
      const { userData } = chatState;
      const dateStr = new Date(userData.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      addMessage(`Perfect! Let me confirm your reservation details:

📅 **Date**: ${dateStr}
🕐 **Time**: ${userData.time}
👥 **Party Size**: ${customInput.people} ${customInput.people === 1 ? 'person' : 'people'}
📧 **Contact**: ${userData.email}

Everything look good?`, 'ai');
      
      setShowChoices([
        { id: 'confirm', text: '✅ Yes, book it!', value: 'confirm' },
        { id: 'modify', text: '✏️ Let me change something', value: 'modify' }
      ]);
    }
  };

  const handleChoice = async (choice: Choice) => {
    addMessage(choice.text, 'user');
    setShowChoices([]);

    if (chatState.step === 'date') {
      if (choice.value === 'custom') {
        await simulateTyping(800);
        addMessage("No problem! Please pick your preferred date:", 'ai');
        setChatState(prev => ({ ...prev, step: 'custom-date' }));
        return;
      }
      
      setChatState(prev => ({
        ...prev,
        userData: { ...prev.userData, date: choice.value as string },
        step: 'time'
      }));

      await simulateTyping(1000);
      addMessage(`Perfect! ${choice.text} it is. Now, what time would you prefer?`, 'ai');
      setShowChoices(getTimeChoices());

    } else if (chatState.step === 'time') {
      if (choice.value === 'custom') {
        await simulateTyping(800);
        addMessage("Of course! Please select your preferred time:", 'ai');
        setChatState(prev => ({ ...prev, step: 'custom-time' }));
        return;
      }

      setChatState(prev => ({
        ...prev,
        userData: { ...prev.userData, time: choice.value as string },
        step: 'people'
      }));

      await simulateTyping(1200);
      addMessage(`Excellent choice! ${choice.text} is a great time. How many people will be joining you?`, 'ai');
      setShowChoices(getPeopleChoices());

    } else if (chatState.step === 'people') {
      if (choice.value === 'custom') {
        await simulateTyping(800);
        addMessage("Sure thing! Please enter the number of people:", 'ai');
        setChatState(prev => ({ ...prev, step: 'custom-people' }));
        return;
      }

      setChatState(prev => ({
        ...prev,
        userData: { ...prev.userData, people: choice.value as number },
        step: 'confirm'
      }));

      await simulateTyping(1500);
      const { userData } = chatState;
      const dateStr = new Date(userData.date || (choice.value as string)).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      addMessage(`Perfect! Let me confirm your reservation details:

📅 **Date**: ${dateStr}
🕐 **Time**: ${userData.time}
👥 **Party Size**: ${choice.value} ${(choice.value as number) === 1 ? 'person' : 'people'}
📧 **Contact**: ${userData.email}

Everything look good?`, 'ai');
      
      setShowChoices([
        { id: 'confirm', text: '✅ Yes, book it!', value: 'confirm' },
        { id: 'modify', text: '✏️ Let me change something', value: 'modify' }
      ]);

    } else if (chatState.step === 'confirm') {
      if (choice.value === 'confirm') {
        await simulateTyping(2000);
        addMessage("🎉 Fantastic! I&apos;m booking your table now...", 'ai');
        
        // Actually create the booking
        try {
          console.log('💾 Assistant: Creating booking in Supabase...');
          const newBooking = await addBooking({
            name: chatState.userData.name,
            email: chatState.userData.email,
            date: chatState.userData.date,
            time: chatState.userData.time,
            people: chatState.userData.people
          });

          if (!newBooking) {
            throw new Error('Failed to create booking');
          }

          console.log('✅ Assistant: Booking created successfully:', newBooking);

          // Send confirmation email
          try {
            const emailResponse = await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newBooking),
            });

            const emailResult = await emailResponse.json();
            
            await simulateTyping(1500);
            if (emailResult.success) {
              if (emailResult.demo) {
                addMessage(`✅ **Reservation Confirmed!**

Your table has been successfully booked. In a real environment, you would receive a confirmation email at ${chatState.userData.email}.

**Reservation ID**: #${newBooking.id.slice(-6)}

We're looking forward to serving you! If you need to make any changes, feel free to contact us.`, 'ai');
              } else {
                addMessage(`✅ **Reservation Confirmed!**

Your table has been successfully booked. A confirmation email has been sent to ${chatState.userData.email}.

**Reservation ID**: #${newBooking.id.slice(-6)}

We're looking forward to serving you! If you need to make any changes, feel free to contact us.`, 'ai');
              }
            } else {
              addMessage(`✅ **Reservation Confirmed!**

Your table has been successfully booked. There was an issue sending the confirmation email, but your reservation is secure.

**Reservation ID**: #${newBooking.id.slice(-6)}

We're looking forward to serving you! If you need to make any changes, feel free to contact us.`, 'ai');
            }
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
            await simulateTyping(1500);
            addMessage(`✅ **Reservation Confirmed!**

Your table has been successfully booked. There was an issue sending the confirmation email, but your reservation is secure.

**Reservation ID**: #${newBooking.id.slice(-6)}

We're looking forward to serving you! If you need to make any changes, feel free to contact us.`, 'ai');
          }

          setChatState(prev => ({ ...prev, step: 'complete' }));
          setShowChoices([
            { id: 'new', text: '🆕 Book another table', value: 'new' },
            { id: 'view', text: '📋 View all bookings', value: 'view' }
          ]);

        } catch (error) {
          console.error('❌ Assistant: Booking creation failed:', error);
          await simulateTyping(1000);
          addMessage("❌ I apologize, but there was an issue with your booking. Please try again or contact us directly.", 'ai');
        }
      } else if (choice.value === 'modify') {
        await simulateTyping(800);
        addMessage("No worries! What would you like to change?", 'ai');
        setShowChoices([
          { id: 'date', text: '📅 Change date', value: 'date' },
          { id: 'time', text: '🕐 Change time', value: 'time' },
          { id: 'people', text: '👥 Change party size', value: 'people' }
        ]);
      }
    } else if (chatState.step === 'complete') {
      if (choice.value === 'new') {
        // Reset everything for a new booking
        window.location.reload();
      } else if (choice.value === 'view') {
        router.push('/admin');
      }
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-4 bg-white/5 rounded-2xl rounded-bl-none max-w-xs">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-white/60 text-sm">AI is thinking...</span>
    </div>
  );

  if (chatState.step === 'setup') {
    return (
      <Section className="py-8 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <FadeContent duration={1000}>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-light text-white mb-6">
                AI Reservation Assistant
              </h1>
              <p className="text-white/80 text-lg font-light">
                Let our AI help you find and book the perfect table
              </p>
            </div>
          </FadeContent>

          <FadeContent duration={1000} delay={400}>
            <div className="card p-6 md:p-8">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h2 className="text-xl font-medium text-white mb-2">
                    Welcome! Let&apos;s get started
                  </h2>
                  <p className="text-white/70">
                    I&apos;ll need your name and email to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={setupForm.name}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field w-full"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={setupForm.email}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <ClickSpark sparkColor="#60a5fa" sparkCount={6} sparkRadius={15}>
                  <button
                    onClick={handleStartChat}
                    disabled={!setupForm.name.trim() || !setupForm.email.trim()}
                    className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Chat with AI Assistant
                  </button>
                </ClickSpark>
              </div>
            </div>
          </FadeContent>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-200px)] flex flex-col">
        {/* Chat Header */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-t-2xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h2 className="font-medium text-white">AI Assistant</h2>
            <p className="text-white/60 text-sm">Online • Ready to help</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-black/10 backdrop-blur-xl border-x border-white/10 p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white/10 text-white rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-white/50'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Choices/Input Area */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-b-2xl p-4">
          {/* Custom Date Input */}
          {chatState.step === 'custom-date' && (
            <div className="space-y-4">
              <p className="text-white/70 text-sm">Pick your preferred date:</p>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={customInput.date}
                  onChange={(e) => setCustomInput(prev => ({ ...prev, date: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && customInput.date && handleCustomSubmit('date')}
                  className="input-field flex-1"
                  min={new Date().toISOString().split('T')[0]}
                />
                <ClickSpark sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                  <button
                    onClick={() => handleCustomSubmit('date')}
                    disabled={!customInput.date}
                    className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                </ClickSpark>
              </div>
            </div>
          )}

          {/* Custom Time Input */}
          {chatState.step === 'custom-time' && (
            <div className="space-y-4">
              <p className="text-white/70 text-sm">Select your preferred time:</p>
              <div className="flex gap-3">
                <input
                  type="time"
                  value={customInput.time}
                  onChange={(e) => setCustomInput(prev => ({ ...prev, time: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && customInput.time && handleCustomSubmit('time')}
                  className="input-field flex-1"
                  min="11:00"
                  max="22:00"
                />
                <ClickSpark sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                  <button
                    onClick={() => handleCustomSubmit('time')}
                    disabled={!customInput.time}
                    className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                </ClickSpark>
              </div>
            </div>
          )}

          {/* Custom People Input */}
          {chatState.step === 'custom-people' && (
            <div className="space-y-4">
              <p className="text-white/70 text-sm">How many people will be dining?</p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-4 flex-1 justify-center">
                  <ClickSpark sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                    <button
                      onClick={() => setCustomInput(prev => ({ ...prev, people: Math.max(1, prev.people - 1) }))}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-colors border border-white/20 hover:border-white/40"
                    >
                      −
                    </button>
                  </ClickSpark>
                  
                  <Counter
                    value={customInput.people}
                    fontSize={28}
                    places={[10, 1]}
                    textColor="white"
                    containerStyle={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  />
                  
                  <ClickSpark sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                    <button
                      onClick={() => setCustomInput(prev => ({ ...prev, people: Math.min(20, prev.people + 1) }))}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-colors border border-white/20 hover:border-white/40"
                    >
                      +
                    </button>
                  </ClickSpark>
                </div>
                
                <ClickSpark sparkColor="#60a5fa" sparkCount={6} sparkRadius={15}>
                  <button
                    onClick={() => handleCustomSubmit('people')}
                    disabled={customInput.people < 1}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Confirm
                  </button>
                </ClickSpark>
              </div>
              
              <div className="text-center">
                <p className="text-white/50 text-sm">
                  {customInput.people === 1 ? '1 person' : `${customInput.people} people`}
                </p>
              </div>
            </div>
          )}

          {/* Regular Choices */}
          {showChoices.length > 0 && !['custom-date', 'custom-time', 'custom-people'].includes(chatState.step) && (
            <div className="space-y-2">
              <p className="text-white/70 text-sm mb-3">Choose an option:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {showChoices.map((choice) => (
                  <ClickSpark key={choice.id} sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                    <button
                      onClick={() => handleChoice(choice)}
                      className="w-full p-3 text-left bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white border border-white/10 hover:border-white/30"
                    >
                      {choice.text}
                    </button>
                  </ClickSpark>
                ))}
              </div>
            </div>
          )}

          {/* Default State */}
          {showChoices.length === 0 && !['custom-date', 'custom-time', 'custom-people'].includes(chatState.step) && (
            <div className="text-center text-white/50 py-2">
              {chatState.step === 'complete' ? 'Chat completed! 🎉' : 'Waiting for AI response...'}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}