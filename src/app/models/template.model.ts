export class Template {
    text?: {
        textName?: string;
        textSize?: number;
        textFont?: string;
        textContent?: string;
        positionX?: number;
        positionY?: number;
    };
    barcode?: {
        bcValue?: string;
        bcType?: string;
        bcTextSize?: number;
        bcTextFont?: string;
        bcHeight?: number;
        bcWidth?: number;
        positionX?: number;
        positionY?: number;
    }
}
