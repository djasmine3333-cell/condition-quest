import { Dumbbell, PersonStanding, Droplets, Utensils, Moon, Brain, Focus } from "lucide-react";
import type { QuestCategory } from "@/types/database";
export const CATEGORY_LABELS: Record<QuestCategory, string> = { exercise:"運動", posture:"姿勢", hydration:"水分", nutrition:"食事", sleep:"睡眠", mental:"メンタル", focus:"集中力" };
export const CATEGORY_ICONS: Record<QuestCategory, typeof Dumbbell> = { exercise:Dumbbell, posture:PersonStanding, hydration:Droplets, nutrition:Utensils, sleep:Moon, mental:Brain, focus:Focus };
