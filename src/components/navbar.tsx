"use client";

import Image from "next/image";
import { User, Settings, BookOpen, LogOut, GraduationCap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDisplayName } from "@/utils/get-display-name";
import { getAvatarInitial } from "@/utils/get-avatar-initial";
import { SearchButton } from "@/components/search/search-button";

interface NavbarProps {
    user: {
        name?: string;
        username: string,
        image?: string;
    };
}

export function Navbar({ user }: NavbarProps) {
    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-lg border border-slate-200 shadow-lg px-6 py-3">
                <div className="flex items-center justify-between">

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 hidden sm:block">
                            Scaler Lite
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">


                        <SearchButton />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center space-x-2 hover:bg-slate-100 rounded-md p-1 transition-colors">
                                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center overflow-hidden">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.username}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {getAvatarInitial(user.name, user.username)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                        {getDisplayName(user.name, user.username)}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>My Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    <span>My Courses</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    <span>All Courses</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
