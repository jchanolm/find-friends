// components/RecommendationHistory.tsx
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { sdk } from '@farcaster/frame-sdk';

interface Recommendation {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  approved: boolean;
  pfpUrl: string;
  fid?: number;
  recentCasts?: {
    text: string;
    timestamp: string;
  }[];
}

export const RecommendationHistory: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, this would come from an API
    // For MVP, we'll load from localStorage
    const savedRecs = localStorage.getItem('warpbuddy_approved');
    if (savedRecs) {
      try {
        const parsed = JSON.parse(savedRecs);
        
        // Add some mock recent casts to the data for demo purposes
        const enhanced = parsed.map((rec: Recommendation) => ({
          ...rec,
          fid: Math.floor(Math.random() * 10000), // Mock FID for demo
          recentCasts: [
            {
              text: "Just published my thoughts on the latest web3 developments. Check it out!",
              timestamp: "2h ago"
            },
            {
              text: "Anyone interested in collaborating on a new project? DM me!",
              timestamp: "1d ago"
            }
          ]
        }));
        
        setRecommendations(enhanced);
      } catch (e) {
        console.error("Error parsing recommendations", e);
      }
    }
  }, []);

  const viewProfile = (fid: number) => {
    if (fid) {
      sdk.actions.viewProfile({ fid });
    }
  };
  
  const toggleExpand = (id: number) => {
    setExpandedUser(expandedUser === id ? null : id);
  };
  
  const handleRemove = (id: number) => {
    const newRecs = recommendations.filter(rec => rec.id !== id);
    setRecommendations(newRecs);
    localStorage.setItem('warpbuddy_approved', JSON.stringify(newRecs));
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Saved People</h2>
        <p className="text-gray-500 mb-4">
          You haven't saved anyone yet. Check back tomorrow for new recommendations!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Saved People</h2>
      <div className="space-y-5">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            className="rounded-xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <div className="p-4 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img src={rec.pfpUrl} alt={rec.displayName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-800">{rec.displayName}</h3>
                <p className="text-sm text-blue-600">@{rec.username}</p>
                <p className="text-sm text-gray-600 mt-1">{rec.bio}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="bubble"
                  onClick={() => viewProfile(rec.fid || 0)}
                  className="text-sm px-4 py-2"
                >
                  View
                </Button>
                <button
                  onClick={() => toggleExpand(rec.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 bg-white rounded-full px-3 py-1 shadow-sm"
                >
                  {expandedUser === rec.id ? 'Less' : 'More'}
                </button>
              </div>
            </div>
            
            {expandedUser === rec.id && (
              <div className="p-4 border-t border-blue-100">
                <h4 className="text-sm font-medium mb-3 text-blue-800">Recent Casts</h4>
                {rec.recentCasts && rec.recentCasts.length > 0 ? (
                  <div className="space-y-3">
                    {rec.recentCasts.map((cast, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-sm">{cast.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{cast.timestamp}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent casts</p>
                )}
                
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleRemove(rec.id)}
                    className="text-sm px-4 py-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    Remove
                  </Button>
                  <Button
                    variant="bubble"
                    onClick={() => sdk.actions.composeCast({ 
                      text: `Hey @${rec.username}, I found you through WarpBuddy and wanted to connect!`,
                      close: false
                    })}
                    className="text-sm px-4 py-2"
                  >
                    Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};