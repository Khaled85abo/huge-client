export interface Annotation {
    dir: string;
    class_id: number;
    x_center: number;
    y_center: number;
    width: number;
    height: number;
}

export interface Annotations {
    [key: string]: Annotation[];
}

export interface Image {
    name: string;
    dir: string;
    url: string;
}