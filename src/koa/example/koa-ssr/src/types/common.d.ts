/// <reference types="react" />
export declare type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
export declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare type CF = () => void;
export declare type CO<T = any> = {
    [key: string]: T;
};
export declare type BaseState = Partial<{
    title: string;
}>;
export declare type BaseProps = Partial<{
    children?: React.ReactNode;
    dispatch?: Function | any;
}>;
