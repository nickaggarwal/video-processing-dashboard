export interface TableData<T> {
    headerRow: string[];
    headerRowNames: string[];
    dataRows: T[];
}

export interface Action {
    name: string;
    component: {
        icon: string;
        onClickFn: string;
    }
}
