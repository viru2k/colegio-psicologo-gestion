export class FacturaAlicuotaAsociada {
    
    id:string;
    importe_gravado:number;
    Importe:number;
    factura_encabezado_id:string;

    constructor( 
        id:string,
        importe_gravado:number,
        Importe:number,
        factura_encabezado_id:string){

            this.id = id;
            this.importe_gravado = importe_gravado;
            this.Importe = Importe;
            this.factura_encabezado_id = factura_encabezado_id;
        }
}
