export class Concepto {
    
    id_pago_historico:string;
    id_concepto:string;
    id_usuario:string;
    mat_concepto:string;
    mat_descripcion:string;
    mat_estado:string;
    mat_fecha_pago:string;
    mat_fecha_vencimiento:string;
    mat_id_plan:string;
    mat_interes: number;
    mat_matricula:string;
    mat_monto: number;
    mat_monto_cobrado: number;
    mat_nombreyapellido:string;
    mat_num_cuota: number;
    mat_numero_comprobante:string;
    mat_tipo_pago:string;

    constructor( 
        id_pago_historico:string,
        id_concepto:string,
        id_usuario:string,
        mat_concepto:string,
        mat_descripcion:string,
        mat_estado:string,
        mat_fecha_pago:string,
        mat_fecha_vencimiento:string,
        mat_id_plan:string,
        mat_interes: number,
        mat_matricula:string,
        mat_monto: number,
        mat_monto_cobrado: number,
        mat_nombreyapellido:string,
        mat_num_cuota: number,
        mat_numero_comprobante:string,
        mat_tipo_pago:string
        
        ){

            this.id_pago_historico = id_pago_historico;
            this.id_concepto = id_concepto;
            this.id_usuario = id_usuario;
            this.mat_concepto = mat_concepto;
            this.mat_descripcion = mat_descripcion;
            this.mat_estado = mat_estado;
            this.mat_fecha_pago = mat_fecha_pago;
            this.mat_fecha_vencimiento = mat_fecha_vencimiento;
            this.mat_id_plan = mat_id_plan;
            this.mat_interes = mat_interes;
            this.mat_matricula = mat_matricula;
            this.mat_monto = mat_monto;
            this.mat_monto_cobrado = mat_monto_cobrado;
            this.mat_nombreyapellido = mat_nombreyapellido;
            this.mat_num_cuota = mat_num_cuota;
            this.mat_numero_comprobante = mat_numero_comprobante;
            this.mat_tipo_pago = mat_tipo_pago;
        }
}
