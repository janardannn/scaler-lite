"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
import { useEffect } from "react";

interface NavbarProps {
    user: {
        name: string;
        username: string,
        email: string,
        image: string | null;
    };
}

export function Navbar() {
    // user.image = null; // test avatar fallback 

    const { data: session, status } = useSession()
    const router = useRouter()


    useEffect(() => {
        if (status === "loading") return // wait for session
        if (!session) {
            router.push('/auth/sign-in')
        }
    }, [session, status, router])

    const user = session?.user ? {
        name: session.user.name || "User",
        username: session.user.email?.split('@')[0] || "",
        email: session.user.email || "",
        image: session.user.image || null,
        type: session.user.role?.toUpperCase() || "STUDENT"
    } : {
        name: "User",
        username: "user",
        email: "user@example.com",
        image: null,
        type: "STUDENT"
    }

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-lg border border-slate-200 shadow-lg px-6 py-3">
                <div className="flex items-center justify-between">

                    <div className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => { router.push('/') }}>
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
                                    <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={getDisplayName(user.name, user.username)[0].toUpperCase()}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                                unoptimized
                                                priority // img glitched otherwise, not loader [Intervention] Images loaded lazily and replaced with placeholders. Load events are deferred. See https://go.microsoft.com/fwlink/?linkid=2048113
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
                                <DropdownMenuItem
                                    onClick={() => { router.push("/profile/complete") }}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>My Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => { router.push("/courses/my-courses") }}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    <span>My Courses</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => { router.push("/courses") }}>
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    <span>All Courses</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
