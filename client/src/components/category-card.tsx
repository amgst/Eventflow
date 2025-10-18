import { Music, Briefcase, Trophy, Globe, Users, Palette, Cpu, Coffee } from "lucide-react";
import type { Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
  eventCount: number;
}

const categoryIcons: Record<Category, any> = {
  "Music": Music,
  "Workshop": Briefcase,
  "Sports": Trophy,
  "Cultural": Globe,
  "Networking": Users,
  "Art": Palette,
  "Technology": Cpu,
  "Food & Drink": Coffee,
};

const categoryColors: Record<Category, string> = {
  "Music": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "Workshop": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Sports": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "Cultural": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  "Networking": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  "Art": "bg-indigo-500/10 text-indigo-400 dark:text-indigo-400 border-indigo-500/20",
  "Technology": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  "Food & Drink": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function CategoryCard({ category, eventCount }: CategoryCardProps) {
  const Icon = categoryIcons[category];
  
  return (
    <Link href={`/events?category=${encodeURIComponent(category)}`}>
      <div 
        className={`flex flex-col items-center justify-center p-6 rounded-xl border hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer min-w-[160px] ${categoryColors[category]}`}
        data-testid={`card-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Icon className="h-8 w-8 mb-3" />
        <h3 className="font-display font-semibold text-lg mb-1">{category}</h3>
        <p className="text-sm opacity-80" data-testid={`text-event-count-${category.toLowerCase().replace(/\s+/g, '-')}`}>
          {eventCount} events
        </p>
      </div>
    </Link>
  );
}
