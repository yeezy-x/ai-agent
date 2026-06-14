import { Type } from "@google/genai"

export interface Tool{
    name:string,
    description:string,
    parameters:{
        type:Type.OBJECT,
        properties:Record<string,unknown>,
        required?:string[];
    }
    execute(args:Record<string,unknown>): Promise<unknown>
} 