// components/UserCard.tsx
import React from 'react';

interface UserProps {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
}

export const UserCard: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
      <div className="flex-shrink-0">
        {user.pfpUrl ? (
          <img
            src={user.pfpUrl}
            alt="Profile"
            className="h-14 w-14 rounded-full border-2 border-white shadow-sm"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl">
              {user.displayName?.charAt(0) || user.username?.charAt(0) || '?'}
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-800">
          {user.displayName || user.username || `User #${user.fid}`}
        </h3>
        {user.username && (
          <p className="text-blue-600">@{user.username}</p>
        )}
      </div>
    </div>
  );
};