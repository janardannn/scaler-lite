"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Mail } from "lucide-react"

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-primary/30 flex items-center justify-center px-4">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-32 right-32 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-slate-200/50 rounded-full blur-xl" />

            <Card className="w-full max-w-md bg-white border border-dashed border-slate-500 shadow-lg ">
                <CardHeader className="text-center space-y-6 pt-12 pb-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-semibold text-slate-900">
                            sign in to scaler lite
                        </CardTitle>
                        <p className="text-slate-600">
                            welcome back, ready to learn?
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    <Button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-medium"
                        size="lg"
                    >
                        <Mail className="w-5 h-5 mr-2" />
                        continue with google
                    </Button>


                </CardContent>
            </Card>
        </div>
    )
}
