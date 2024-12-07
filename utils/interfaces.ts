export enum Role {
    User = 0,
    Bot = 1,
}

export interface Message {
    id: string;
    role: Role;
    content: string;
}

export interface Chat {
    id: number;
    title: string;
}