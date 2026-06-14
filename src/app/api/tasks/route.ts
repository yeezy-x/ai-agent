import { createTask, getTasks } from "@/server/services/task.service"
import { NextRequest, NextResponse } from "next/server"

//get /api/tasks - list all tasks
export async function GET(){
    try{
        const allTasks=await getTasks();
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
        const newTask = await createTask({
            title: body.title,
            description: body.description,
            priority: body.priority,
            dueDate: body.dueDate,
        })
        return NextResponse.json(newTask, { status: 201 });
    }catch(error){
        console.log(error);
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        )
    }
    
}

