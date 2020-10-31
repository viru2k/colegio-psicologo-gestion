
export class Orden {


    id: string;
    mat_matricula: string;
    obra_social_id: string;
    sesion_id: string;
    paciente_id: string;
    fecha: string;
    cantidad: number;
    precio_sesion: number;
    precio_total: number;
    estado_liquidacion: string;
    liq_numero: string;
    fecha_presentacion: string;


    constructor(
        id: string,
        mat_matricula: string,
        obra_social_id: string,
        sesion_id: string,
        paciente_id: string,
        fecha: string,
        cantidad: number,
        precio_sesion: number,
        precio_total: number,
        estado_liquidacion: string,
        liq_numero: string,
        fecha_presentacion: string
          ) {
        
        this.id =    id;
        this.mat_matricula =    mat_matricula;
        this.obra_social_id =    obra_social_id;
        this.sesion_id =    sesion_id;
        this.paciente_id =    paciente_id;
        this.fecha =    fecha;
        this.cantidad =    cantidad;
        this.precio_sesion =    precio_sesion;
        this.precio_total =    precio_total;
        this.estado_liquidacion =    estado_liquidacion;
        this.liq_numero =    liq_numero;
        this.fecha_presentacion =    fecha_presentacion;
    }
}