export interface index {
    counter: number,
    name: string,
    isAdmin: boolean,
    nameLength:number,
    // @ts-ignore
    $patch(arg: { name: string }),
}
