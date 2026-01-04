'use client';

import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';

const colorPalettes = [
    { id: 'indigo', name: 'Royal Indigo', hex: '#4f46e5', category: 'Default Corporate', primary: '#4f46e5', light: '#eff6ff' },
    { id: 'emerald', name: 'Growth Emerald', hex: '#059669', category: 'Finance & Healthcare', primary: '#059669', light: '#ecfdf5' },
    { id: 'rose', name: 'Passion Rose', hex: '#e11d48', category: 'Creative & NGO', primary: '#e11d48', light: '#fff1f2' },
    { id: 'slate', name: 'Classic Slate', hex: '#334155', category: 'Modern Minimalist', primary: '#334155', light: '#f8fafc' },
    { id: 'amber', name: 'Solar Amber', hex: '#d97706', category: 'High Energy & Sales', primary: '#d97706', light: '#fffbeb' },
    { id: 'violet', name: 'Deep Violet', hex: '#7c3aed', category: 'Luxury & Visionary', primary: '#7c3aed', light: '#faf5ff' },
];

export function TabColors() {
    const { currentResume, setColor } = useResumeStore();
    const selectedColor = currentResume?.colorId || 'indigo';

    return (
        <div>
            <header className="mb-8">
                <h2 className="text-xl font-display font-bold text-slate-800">Accent Colors</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium italic">
                    Apply a brand identity to your resume with professionally tuned palettes.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {colorPalettes.map((palette) => (
                    <button
                        key={palette.id}
                        onClick={() => setColor(palette.id)}
                        className={cn(
                            'group text-left bg-white border-2 p-4 rounded-2xl transition-all hover:border-indigo-100',
                            selectedColor === palette.id
                                ? 'border-indigo-600 shadow-[0_0_0_2px_#4f46e5]'
                                : 'border-slate-100'
                        )}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-8 h-8 rounded-full shadow-lg"
                                style={{ backgroundColor: palette.primary, boxShadow: `0 4px 6px ${palette.primary}20` }}
                            />
                            <div
                                className="w-8 h-8 rounded-full border"
                                style={{ backgroundColor: palette.light, borderColor: `${palette.primary}20` }}
                            />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700">{palette.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                            {palette.category}
                        </p>
                    </button>
                ))}

                {/* Custom Color Picker */}
                <div className="group relative bg-white border-2 border-slate-100 p-4 rounded-2xl transition-all hover:border-indigo-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 shadow-lg flex items-center justify-center overflow-hidden border border-slate-200">
                            <i className="fa-solid fa-plus text-[10px] text-slate-400"></i>
                        </div>
                        <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                                // Handle custom color
                                console.log('Custom color:', e.target.value);
                            }}
                        />
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-700">Custom Hue</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                        Click to pick color
                    </p>
                </div>
            </div>
        </div>
    );
}
