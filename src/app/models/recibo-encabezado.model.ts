import { ReciboElectronico } from "./recibo-electronico.model";
export class ReciboEncabezado {
  id: string;
  matricula: string;
  nombreyapellido: string;
  total: number;
  mat_tipo_pago: string;
  mat_fecha_pago: string;
  usuario_id: string;
  reciboElectronico: ReciboElectronico[];
  punto_vta: string;
  sector_cobro: string;
  constructor(
    id: string,
    matricula: string,
    nombreyapellido: string,
    total: number,
    mat_tipo_pago: string,
    mat_fecha_pago: string,
    usuario_id: string,
    reciboElectronico: ReciboElectronico[],
    punto_vta: string,
    sector_cobro: string
  ) {
    this.id = id;
    this.matricula = matricula;
    this.nombreyapellido = nombreyapellido;
    this.total = total;
    this.mat_tipo_pago = mat_tipo_pago;
    this.mat_fecha_pago = mat_fecha_pago;
    this.usuario_id = usuario_id;
    this.reciboElectronico = reciboElectronico;
    this.punto_vta = punto_vta;
    this.sector_cobro = sector_cobro;
  }
}
