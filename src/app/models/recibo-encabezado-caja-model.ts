import { ReciboElectronicoCaja } from "./recibo-electronica-caja.model";

export class ReciboEncabezadoCaja {
  punto_vta: string;
  proveedor_cuit: string;
  proveedor_nombre: string;
  fecha_carga: string;
  total: number;
  usuario_id: string;
  mat_tipo_pago: string;
  sector: string;
  reciboElectronicoCaja: ReciboElectronicoCaja;
  mov_registro_id: string;
  constructor(
    punto_vta: string,
    proveedor_cuit: string,
    proveedor_nombre: string,
    fecha_carga: string,
    total: number,
    usuario_id: string,
    mat_tipo_pago: string,
    sector: string,
    reciboElectronicoCaja: ReciboElectronicoCaja,
    mov_registro_id: string
  ) {
    this.punto_vta = punto_vta;
    this.proveedor_cuit = proveedor_cuit;
    this.proveedor_nombre = proveedor_nombre;
    this.fecha_carga = fecha_carga;
    this.total = total;
    this.usuario_id = usuario_id;
    this.mat_tipo_pago = mat_tipo_pago;
    this.sector = sector;
    this.reciboElectronicoCaja = reciboElectronicoCaja;
    this.mov_registro_id = mov_registro_id;
  }
}
