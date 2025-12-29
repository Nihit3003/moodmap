import { MoodType } from './types';
import { Briefcase, Heart, Zap, DollarSign, Coffee, Utensils, Moon, Trees } from 'lucide-react';

export const MOOD_OPTIONS = [
  { id: MoodType.WORK, label: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: MoodType.DATE, label: 'Date Night', icon: Heart, color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { id: MoodType.QUICK, label: 'Quick Bite', icon: Zap, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { id: MoodType.BUDGET, label: 'Budget', icon: DollarSign, color: 'bg-green-100 text-green-600 border-green-200' },
  { id: MoodType.COFFEE, label: 'Coffee', icon: Coffee, color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: MoodType.FANCY, label: 'Fancy', icon: Utensils, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { id: MoodType.QUIET, label: 'Quiet', icon: Moon, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { id: MoodType.OUTDOORS, label: 'Outdoors', icon: Trees, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
];