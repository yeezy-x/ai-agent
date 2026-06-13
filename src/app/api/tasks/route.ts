import {db} from "@/db"
import {tasks} from "@/db/schema"
import {desc} from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

//get /api/tasks - list all tasks
export async function GET(){
    try{
        const allTasks=await db.select().from(tasks).orderBy(desc(tasks.createdAt))
        return NextResponse.json(allTasks)
    }catch(error){
        console.log(error);
        return NextResponse.json(
            {error:"Failed to fetch tasks"},
            {status:500}
        )
    }
}

//post /api/tasks - create a new task
export async function POST(req:NextRequest){
    try{
        const body=await req.json()
        if(!body.title || typeof body.title!=='string'){
            return NextResponse.json({error: "Title is required."})
        }
        const [newTask] = await db
        .insert(tasks)
        .values({
        title: body.title,
        description: body.description ?? null,
        priority: body.priority ?? "medium",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        })
        .returning();
    return NextResponse.json(newTask, { status: 201 });
    }catch(error){
        console.log(error);
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        )
    }
    
}

