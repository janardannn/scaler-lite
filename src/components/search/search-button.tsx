// components/search-button.tsx
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search-modal";

export function SearchButton() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // handle Ctrl+K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-500 bg-slate-300 hover:bg-slate-200 rounded-lg transition-colors min-w-0"
            >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:block">Search...</span>
                <div className="hidden sm:flex items-center space-x-1 ml-auto">
                    <kbd className="px-1.5 py-0.5 text-xs bg-white border border-slate-300 rounded shadow-sm">
                        Ctrl
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-xs bg-white border border-slate-300 rounded shadow-sm">
                        K
                    </kbd>
                </div>
            </button>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
