export type ToolProperty = {
  type?: string | string[];
  description?: string;
  enum?: string[];
  items?: unknown;
};

export interface Tool<TArgs=unknown, TResult=unknown>{
    name:string,
    description:string,
    parameters:{
        type:"object",
        properties:Record<string,ToolProperty>,
        required?:string[];
    }
    execute(args:TArgs): Promise<TResult>
}


