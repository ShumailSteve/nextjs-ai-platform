"use client"

import { MessageSquare } from "lucide-react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

import Heading from "@/components/heading"
import { formSchema } from "./constants"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ConversationPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting

    const submitHandler = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    } 

  return (
    <div>
        <Heading
            title="Conversation"
            description="The most advanced conversation model."
            icon={MessageSquare}
            iconColor="text-purple-500"
            bgColor="bg-purple-500/10"
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
                                            placeholder="What is the radius of earth?"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2">
                            Generate
                        </Button>

                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                Message Content
            </div>
        </div>
    </div>
  )
}

export default ConversationPage