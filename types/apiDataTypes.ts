export interface questionList{
    question:string
}

export interface SqlQueryResult {
    columns: string[];
    data: Record<string, string | number | boolean | null>[];
}