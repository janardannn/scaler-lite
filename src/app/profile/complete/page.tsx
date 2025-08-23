"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Loader2, Camera } from "lucide-react"
import axios from "axios"


function ImageUploader({
    image,
    onChange
}: {
    image: string | null;
    onChange: (file: File) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0])
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="relative">
            <div
                className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 cursor-pointer border-2 border-dashed border-slate-300 hover:border-primary transition-colors"
                onClick={handleClick}
            >
                {image ? (
                    <img
                        src={image}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400">
                        <User className="w-8 h-8" />
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled
            />
        </div>
    )
}

export default function CompleteProfilePage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        role: "STUDENT" as "STUDENT" | "INSTRUCTOR"
    })

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            router.push('/auth/signin')
            return
        }

        if (session.user) {
            const generatedUsername = session.user.email?.split('@')[0] || ""
            setFormData({
                name: session.user.name || "",
                username: generatedUsername,
                role: "STUDENT"
            })

            // google sign so may have profile
            if (session.user.image) {
                setImagePreview(session.user.image)
            }
        }
    }, [session, status, router])

    const handleImageChange = (file: File) => {
        setSelectedFile(file)

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setError("Full name is required")
            return
        }

        if (formData.name.trim().length > 30) {
            setError("Name must be 30 characters or less")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            const response = await axios.post('/api/profile', {
                name: formData.name.trim(),
                role: formData.role
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })


            const { user } = response.data

            console.log(user);

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: user.name,
                    role: user.role,
                    image: user.image || session?.user?.image
                }
            })

            router.push('/')

        } catch (err: any) {

            if (err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setIsSubmitting(false)
        }
    }


    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!session) return null

    return (
        <div className="min-h-screen bg-primary/30 flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-white border border-dashed border-slate-500 shadow-lg">
                <CardHeader className="text-center space-y-4 pt-8">
                    <div>
                        <CardTitle className="text-2xl font-semibold text-slate-900">
                            complete your profile
                        </CardTitle>

                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>profile photo</Label>
                            <div className="flex flex-col items-center space-y-2">
                                <ImageUploader
                                    image={imagePreview}
                                    onChange={handleImageChange}
                                />
                                <p className="text-xs text-slate-500 text-center">
                                    click to upload a profile picture
                                </p>
                            </div>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="name">
                                full name

                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="enter your full name"
                                maxLength={30}
                                disabled={isSubmitting}
                                required
                                className={formData.name.length >= 25 ? "border-amber-300 focus:border-amber-500" : ""}
                            />
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="username">username</Label>
                            <Input
                                id="username"
                                disabled
                                value={formData.username}
                            />

                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="role">choose role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: "STUDENT" | "INSTRUCTOR") =>
                                    setFormData(prev => ({ ...prev, role: value }))
                                }
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">STUDENT</SelectItem>
                                    <SelectItem value="INSTRUCTOR">INSTRUCTOR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isSubmitting || formData.name.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    completing profile...
                                </>
                            ) : (
                                "complete profile"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
