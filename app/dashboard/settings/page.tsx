import prisma from "@/app/lib/db"
import { Submitbutton } from "@/components/submitbutton"


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { revalidatePath } from "next/cache"

async function getData(id:string) {
    const data=await prisma.user.findUnique({
        where :{
            id:id,
        },
        select:{
            name:true,
            email:true,
            colorScheme:true
        }
    })
    return data
}

const settingspage = async() => {
    const{getUser}=getKindeServerSession()
    const user= await getUser()
    const data=await getData(user?.id as string)

    async function PostData(formData:FormData) {
        'use server'
        const name=formData.get("name") as string;
        const colorscheme=formData.get("colour") as string;

        await prisma.user.update({
            where:{
                id:user?.id,
            },
            data:{
                name:name ?? undefined,
                colorScheme:colorscheme ?? undefined
            }
        })
        revalidatePath('/',"layout")
        
    }
  return (
    <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
            <div className="grid gap-1"> 
                <h1 className="text-3xl md:text-4xl">Settings</h1>
                <p className="text-lg text-muted-foreground">your profile settings</p>
            </div>
        </div>
        <Card>
            <form action={PostData}>
            <CardHeader>
                <CardTitle>General data</CardTitle>
                <CardDescription>please provide informaiton</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <Label>your Name</Label>
                        <Input name="name" type="text" id="name" placeholder="your name" defaultValue={data?.name ?? undefined}/>
                    </div>
                    <div className="space-y-1">
                        <Label>your Email</Label>
                        <Input name="email" type="email" id="email" placeholder="your email" disabled defaultValue={data?.email}/>
                    </div>
                    <div className="space-y-1">
                        <Label>Colour Schema</Label>
                        <Select name="colour" defaultValue={data?.colorScheme}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="select a colour"/>
                            </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Colour</SelectLabel>
                                        <SelectItem value="theme-green"> Green</SelectItem>
                                        <SelectItem value="theme-violet">Violet</SelectItem>
                                        <SelectItem value="theme-orange">Orange</SelectItem>
                                        <SelectItem value="theme-blue">Blue</SelectItem>
                                        <SelectItem value="theme-rose">Rose</SelectItem>
                                        <SelectItem value="theme-slate">Slate</SelectItem>
                                        <SelectItem value="theme-yellow">Yellow</SelectItem>
                                        <SelectItem value="theme-red">Red</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Submitbutton/>
            </CardFooter>
            </form>
        </Card>
    </div>
    
  )
}

export default settingspage