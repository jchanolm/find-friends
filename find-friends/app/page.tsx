"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { sdk } from "@farcaster/frame-sdk";
import { UserCard } from "./components/ui/UserCard";
import { OnboardingFlow } from "./components/ui/OnboardingFlow";
import { RecommendationHistory } from "./components/ui/RecommendationHistory";
import { Button } from "./components/ui/Button"
import Check from "./svg/Check";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  // Instead of storing the whole context, let's extract only what we need
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [frameAdded, setFrameAdded] = useState(false);

  // Initialize the app and mark as ready (hides splash screen)
  useEffect(() => {
    const initApp = async () => {
      try {
        // Mark the app as ready to hide the splash screen
        await sdk.actions.ready();
        setIsReady(true);
        
        // Get user context and extract the needed properties
        const context = await sdk.context;
        if (context?.user) {
          // Create a simple object with just the properties we need
          setUserInfo({
            fid: context.user.fid,
            username: context.user.username || "",
            displayName: context.user.displayName || "",
            pfpUrl: context.user.pfpUrl || ""
          });
          
          // Check if user has completed onboarding (would come from API in real implementation)
          // For MVP, we'll just use localStorage
          const onboardingCompleted = localStorage.getItem('warpbuddy_onboarded');
          setIsOnboarded(onboardingCompleted === 'true');
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };
    
    initApp();
    
    // Event listeners for frame events
    sdk.on('frameAdded', ({ notificationDetails }) => {
      setFrameAdded(true);
      console.log('App was added!', notificationDetails);
    });
    
    // Cleanup listeners on unmount
    return () => {
      sdk.removeAllListeners();
    };
  }, []);
  
  // Function to handle adding the frame
  const handleAddFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
      setFrameAdded(true);
    } catch (error) {
      console.error("Error adding frame:", error);
    }
  }, []);

  const handleOnboardingComplete = () => {
    // In real implementation, this would save to backend
    localStorage.setItem('warpbuddy_onboarded', 'true');
    setIsOnboarded(true);
  };
  
  const handleUpdatePreferences = () => {
    // Reset onboarding to update preferences
    setIsOnboarded(false);
  };
  
  // Save Frame button logic
  const saveFrameButton = useMemo(() => {
    const getContext = async () => {
      const context = await sdk.context;
      if (context && !context.client.added && !frameAdded) {
        return (
          <button
            type="button"
            onClick={handleAddFrame}
            className="cursor-pointer bg-transparent font-semibold text-sm"
          >
            + SAVE APP
          </button>
        );
      }

      if (frameAdded) {
        return (
          <div className="flex items-center space-x-1 text-sm font-semibold animate-fade-out">
            <Check />
            <span>SAVED</span>
          </div>
        );
      }

      return null;
    };

    return getContext();
  }, [handleAddFrame, frameAdded]);
  
  if (!isReady) {
    return null; // Don't render anything until ready
  }
  
  return (
    <div className="flex flex-col min-h-screen sm:min-h-[820px] font-sans bg-gradient-to-b from-gray-50 to-blue-50 text-black items-center relative">
      <div className="w-screen max-w-[520px]">
        <header className="mr-2 mt-1 flex justify-between">
          <div className="justify-start pl-2 pt-2">
            <h1 className="text-xl font-bold text-blue-600">WarpBuddy</h1>
          </div>
          <div className="pr-2 pt-2 justify-end">{saveFrameButton}</div>
        </header>

        <main className="p-4">
          {userInfo && (
            <div className="mb-6">
              <UserCard user={userInfo} />
            </div>
          )}
          
          {!isOnboarded ? (
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Your Preferences</h2>
                <p className="text-gray-600 mb-4">
                  {localStorage.getItem('warpbuddy_preferences') || "People interested in technology, web3, and design"}
                </p>
                <Button 
                  onClick={handleUpdatePreferences}
                  variant="outline"
                  className="w-full"
                >
                  Update Preferences
                </Button>
              </div>
              
              <RecommendationHistory />
            </div>
          )}
        </main>

        <footer className="absolute bottom-4 flex items-center w-screen max-w-[520px] justify-center">
          <button
            type="button"
            className="mt-4 ml-4 px-2 py-1 flex justify-start rounded-2xl font-semibold opacity-40 border border-black text-xs"
            onClick={() => sdk.actions.openUrl("https://farcaster.xyz")}
          >
            BUILT FOR FARCASTER
          </button>
        </footer>
      </div>
    </div>
  );
}