export class Template {
    _id?: any;
    templateName?: string;
    labelName?: string;
    dpmm?: number;
    height?: number;
    width?: number;
    zplCode?: string;
    text!: {
        textDescription?: string;
        textSize?: number;
        textFont?: string;
        textContent?: string;
        positionX?: number;
        positionY?: number;
        zplCode?: string;
    }[];
    barcode!: {
        bcValue?: string;
        bcType?: string;
        bcTextSize?: number;
        bcTextFont?: string;
        bcHeight?: number;
        bcWidth?: number;
        positionX?: number;
        positionY?: number;
        zplCode?: string;
    }[];
}
