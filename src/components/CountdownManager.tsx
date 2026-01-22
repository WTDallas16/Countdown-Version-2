import { useState } from 'react';
import type { SavedCountdown } from '../types/countdown-manager';
import { format } from 'date-fns';

interface CountdownManagerProps {
  countdowns: SavedCountdown[];
  activeCountdownId: string | null;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function CountdownManager({
  countdowns,
  activeCountdownId,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
  onDuplicate,
}: CountdownManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const startEditing = (countdown: SavedCountdown) => {
    setEditingId(countdown.id);
    setEditName(countdown.name);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">My Countdowns</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
        >
          + New
        </button>
      </div>

      {isCreating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Countdown name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') {
                setIsCreating(false);
                setNewName('');
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewName('');
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {countdowns.map((countdown) => (
          <div
            key={countdown.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              countdown.id === activeCountdownId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {editingId === countdown.id ? (
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(countdown.id);
                    if (e.key === 'Escape') {
                      setEditingId(null);
                      setEditName('');
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRename(countdown.id)}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditName('');
                    }}
                    className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {countdown.name}
                      {countdown.id === activeCountdownId && (
                        <span className="ml-2 text-xs text-blue-600 font-normal">
                          (Active)
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Updated {format(new Date(countdown.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mt-2">
                  {countdown.id !== activeCountdownId && (
                    <button
                      onClick={() => onSwitch(countdown.id)}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Switch
                    </button>
                  )}
                  <button
                    onClick={() => startEditing(countdown)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => onDuplicate(countdown.id)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                  >
                    Duplicate
                  </button>
                  {countdowns.length > 1 && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${countdown.name}"? This cannot be undone.`
                          )
                        ) {
                          onDelete(countdown.id);
                        }
                      }}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {countdowns.length} countdown{countdowns.length !== 1 ? 's' : ''} saved
      </p>
    </div>
  );
}
