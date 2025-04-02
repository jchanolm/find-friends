// components/OnboardingFlow.tsx
import React, { useState } from 'react';
import { Button } from './Button';
import { UserCard } from './UserCard';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState('');
  const [manualUsername, setManualUsername] = useState('');
  const [manualUsernames, setManualUsernames] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      username: 'cryptonative',
      displayName: 'Crypto Native',
      bio: 'Building the future of web3. Daily insights on crypto, NFTs, and DeFi.',
      approved: false,
      pfpUrl: 'https://picsum.photos/seed/user1/200'
    },
    {
      id: 2,
      username: 'designerly',
      displayName: 'Designerly',
      bio: 'UI/UX designer passionate about creating beautiful, functional interfaces.',
      approved: false,
      pfpUrl: 'https://picsum.photos/seed/user2/200'
    },
    {
      id: 3,
      username: 'devbuilder',
      displayName: 'Dev Builder',
      bio: 'Full-stack developer. Open source contributor. Building in public.',
      approved: false,
      pfpUrl: 'https://picsum.photos/seed/user3/200'
    }
  ]);

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(e.target.value);
  };

  const handleManualUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualUsername(e.target.value);
  };

  const handleAddUsername = () => {
    if (manualUsername && manualUsername.trim() && manualUsernames.length < 3) {
      setManualUsernames([...manualUsernames, manualUsername.trim()]);
      setManualUsername('');
    }
  };

  const handleRemoveUsername = (username: string) => {
    setManualUsernames(manualUsernames.filter(u => u !== username));
  };

  const handleNext = () => {
    if (step === 1 && (preferences || manualUsernames.length > 0)) {
      localStorage.setItem('warpbuddy_preferences', preferences);
      localStorage.setItem('warpbuddy_manual_usernames', JSON.stringify(manualUsernames));
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleApprove = (id: number) => {
    setRecommendations(prevRecs => 
      prevRecs.map(rec => 
        rec.id === id ? { ...rec, approved: !rec.approved } : rec
      )
    );
  };

  const handleComplete = () => {
    // Save approved recommendations
    const approved = recommendations.filter(rec => rec.approved);
    localStorage.setItem('warpbuddy_approved', JSON.stringify(approved));
    onComplete();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUsername();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Let's find your people!</h2>
          
          <div className="mb-6">
            <label htmlFor="preferences" className="block text-blue-700 mb-2">
              Describe what kind of people you'd like to connect with:
            </label>
            <textarea
              id="preferences"
              className="w-full p-4 border border-blue-200 rounded-xl mb-2 min-h-[120px] focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-none"
              placeholder="e.g., I'm interested in connecting with developers working on web3 projects, designers with a minimalist aesthetic, and people discussing AI ethics."
              value={preferences}
              onChange={handlePreferenceChange}
            />
            <p className="text-sm text-gray-500">Feel free to be specific about your interests and the type of content you enjoy.</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-blue-700 mb-2">
              Add specific users you already like (optional, up to 3):
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                placeholder="@username"
                value={manualUsername}
                onChange={handleManualUsernameChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={handleAddUsername}
                disabled={manualUsernames.length >= 3 || !manualUsername}
                variant="bubble"
                className="whitespace-nowrap"
              >
                Add User
              </Button>
            </div>
            
            {manualUsernames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {manualUsernames.map(username => (
                  <div key={username} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-1">
                    <span>@{username}</span>
                    <button 
                      onClick={() => handleRemoveUsername(username)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={!preferences && manualUsernames.length === 0}
            className="w-full"
            variant="bubble"
          >
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Here are some suggestions</h2>
          <p className="text-gray-600 mb-4">
            Select the profiles that interest you:
          </p>
          <div className="space-y-4 mb-6">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                className={`rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  rec.approved 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300' 
                  : 'bg-white border border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => handleApprove(rec.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img src={rec.pfpUrl} alt={rec.displayName} className="w-12 h-12 rounded-full shadow-sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-800">{rec.displayName}</h3>
                    <p className="text-sm text-blue-600">@{rec.username}</p>
                    <p className="text-sm text-gray-600 mt-1">{rec.bio}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    rec.approved 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 bg-white'
                  }`}>
                    {rec.approved && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleNext} className="w-full" variant="bubble">
            Next
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">All set!</h2>
          <p className="text-gray-600 mb-4">
            We'll send you a daily notification with new people to connect with based on your preferences.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Tip:</span> Add WarpBuddy to your favorites to get daily recommendations!
            </p>
          </div>
          <Button onClick={handleComplete} className="w-full" variant="bubble">
            Finish
          </Button>
        </>
      )}
    </div>
  );
};