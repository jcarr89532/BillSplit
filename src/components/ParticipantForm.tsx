import React, { useState } from 'react';
import type { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, User } from 'lucide-react';

interface ParticipantFormProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
  className?: string;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({
  participants,
  onParticipantsChange,
  className = ''
}) => {
  const [newParticipant, setNewParticipant] = useState({ name: '', phoneNumber: '' });

  const addParticipant = () => {
    if (newParticipant.name.trim() && newParticipant.phoneNumber.trim()) {
      const participant: Participant = {
        id: Date.now().toString(),
        name: newParticipant.name.trim(),
        phoneNumber: newParticipant.phoneNumber.trim()
      };
      
      onParticipantsChange([...participants, participant]);
      setNewParticipant({ name: '', phoneNumber: '' });
    }
  };

  const removeParticipant = (id: string) => {
    onParticipantsChange(participants.filter(p => p.id !== id));
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-light text-gray-100">Participants</h3>
        <span className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full">{participants.length} people</span>
      </div>

      {/* Add new participant form */}
      <Card className="p-6 mb-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participant-name" className="text-sm font-medium text-gray-300">Name</Label>
              <Input
                id="participant-name"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                placeholder="Enter name"
                onKeyPress={handleKeyPress}
                className="h-12 border border-gray-600 rounded-lg px-4 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-gray-100 focus:outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participant-phone" className="text-sm font-medium text-gray-300">Phone Number</Label>
              <Input
                id="participant-phone"
                value={newParticipant.phoneNumber}
                onChange={(e) => setNewParticipant({ ...newParticipant, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                onKeyPress={handleKeyPress}
                className="h-12 border border-gray-600 rounded-lg px-4 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-gray-100 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>
          <Button 
            onClick={addParticipant} 
            disabled={!newParticipant.name.trim() || !newParticipant.phoneNumber.trim()}
            className="w-full sm:w-auto h-12 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Participant
          </Button>
        </div>
      </Card>

      {/* Participants list */}
      <div className="space-y-3">
        {participants.map((participant) => (
          <Card key={participant.id} className="p-4 bg-gray-800 border border-gray-700 shadow-lg rounded-xl hover:bg-gray-700 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="p-3 bg-gray-700 rounded-xl flex-shrink-0">
                  <User className="h-6 w-6 text-gray-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate text-gray-100 text-lg">{participant.name}</div>
                  <div className="text-sm text-gray-300 truncate">{participant.phoneNumber}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeParticipant(participant.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0 ml-3 rounded-full p-2 transition-all duration-300"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {participants.length === 0 && (
        <Card className="p-8 text-center bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-2 font-medium">No participants added yet</p>
          <p className="text-sm text-gray-400">Add people who will be splitting the receipt</p>
        </Card>
      )}
    </div>
  );
};
