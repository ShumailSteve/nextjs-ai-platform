"use client"

import { useState } from "react"
import { Code } from "lucide-react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from 'axios'
import { useRouter } from "next/navigation"
import { ChatCompletionRequestMessage } from "openai"
import ReactMarkdown from "react-markdown"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

import Heading from "@/components/heading"
import { UserAvatar } from "@/components/user-avatar"
import { BotAvatar } from "@/components/bot-avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/empty"
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { formSchema } from "./constants"

const CodePage  = () => {
    const router = useRouter()
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting

    const submitHandler = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt,
            }

            const newMessage = [...messages, userMessage]

            const res = await axios.post("/api/code", {
                messages: newMessage
            })

            setMessages((current) => [...current, userMessage, res.data])

            form.reset()
        } catch (err) {
            console.log(err)
        } finally {
            router.refresh()
        }   
    } 

  return (
    <div>
        <Heading
            title="Code Generation"
            description="The most advanced code model."
            icon={Code}
            iconColor="text-green-700"
            bgColor="bg-green-700/10"
        />
        <div className="px-4 lg:px-8">
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(submitHandler)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6
                           focus-within:shadow-sm grid grid-cols-12 gap-2
                        "
                    >
                        <FormField
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input 
                                            className="border-0 outline-none 
                                            focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="Explain useEffect hook in react js"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2" disabled={isLoading}>
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                { isLoading && (
                    <div className="p-8 rounded-lg w-dull flex items-center justify-center bg-muted">
                        <Loader />
                    </div>
                )}
                {messages.length === 0 && !isLoading && (
                    <Empty label="No Conversation started." />
                )}
                <div className="flex flex-col-reverse gap-y-4">
                    {messages.map((message) => (
                        <div 
                            key={message.content}
                            className={cn(
                                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                message.role === "user" 
                                  ? "bg-white border border-black/10"
                                  : "bg-muted"
                            )}
                        >
                            {message.role === "user" ? <UserAvatar /> : <BotAvatar /> }
                            <ReactMarkdown
                                className="text-sm overflow-hidden leading-7"
                                components={{
                                    pre: ({ node, ...props }) => (
                                        <div 
                                            className="overflow-auto w-full my-3 bg-black/90 text-white p-3 rounded-lg"
                                        >
                                            <pre {...props} />
                                        </div>
                                    ),
                                    code: ({ node, ...props }) => (
                                        <code 
                                            className="bg-black/10 p-1 rounded-lg" 
                                            {...props} 
                                        />
                                    ),
                                }}
                            >
                                {message.content || ""}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CodePage 