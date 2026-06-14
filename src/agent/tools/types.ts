export interface Tool<TArgs=unknown, TResult=unknown>{
    name:string,
    description:string,
    parameters:{
        type:"object",
        properties:Record<string,unknown>,
        required?:string[];
    }
    execute(args:TArgs): Promise<TResult>
}

