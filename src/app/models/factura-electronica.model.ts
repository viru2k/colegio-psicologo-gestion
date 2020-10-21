import { FacturaElectronicaRenglon } from './factura-electronica-renglon.model';
import { FacturaAlicuotaAsociada } from './factura_alicuota_asociada.model';
export class FacturaElectronica {

    
    
    
    id: string;
    factura_pto_vta_id: string;
    factura_comprobante_id: string;
    factura_concepto_id: string;
    factura_documento_comprador_id: string;
    factura_documento: string;
    factura_cliente: string;
    factura_numero: string;
    fecha: string;
    fecha_desde: string;
    fecha_hasta: string;
    importe_gravado: number;
    importe_exento_iva: number;
    importe_iva: number;
    importe_total: number;
    facturaAlicuotaAsociada: FacturaAlicuotaAsociada[];
    facturaElectronicaRenglon: FacturaElectronicaRenglon[];
    cae: string;
    cae_vto: string;
    medico_id: string;
    factura_obra_social: string;
    elementoCondicionIva: string;
    es_afip: string;

    constructor(
      id: string,
      factura_pto_vta_id: string,
      factura_comprobante_id: string,
      factura_concepto_id: string,
      factura_documento_comprador_id: string,
      factura_documento: string,
      factura_cliente: string,
      factura_numero: string,
      fecha: string,
      fecha_desde: string,
      fecha_hasta: string,
      importe_gravado: number,
      importe_exento_iva: number,
      importe_iva: number,
      importe_total: number,
      facturaAlicuotaAsociada: FacturaAlicuotaAsociada[],
      facturaElectronicaRenglon: FacturaElectronicaRenglon[],
      cae: string,
      cae_vto: string,
      medico_id: string,
      factura_obra_social: string,
      elementoCondicionIva: string,
      es_afip: string
          ) {
        
            this.id = id;
            this.factura_pto_vta_id = factura_pto_vta_id;
            this.factura_comprobante_id = factura_comprobante_id;
            this.factura_concepto_id = factura_concepto_id;
            this.factura_documento_comprador_id = factura_documento_comprador_id;
            this.factura_documento = factura_documento;
            this.factura_cliente = factura_cliente;
            this.factura_numero = factura_numero;
            this.fecha = fecha;
            this.fecha_desde = fecha_desde;
            this.fecha_hasta = fecha_hasta;
            this.importe_gravado = importe_gravado;
            this.importe_exento_iva = importe_exento_iva;
            this.importe_iva = importe_iva;
            this.importe_total = importe_total;
            this.facturaAlicuotaAsociada = facturaAlicuotaAsociada;
            this.facturaElectronicaRenglon = facturaElectronicaRenglon;
            this.cae = cae;
            this.cae_vto = cae_vto;
            this.medico_id = medico_id;
            this.factura_obra_social = factura_obra_social;
            this.elementoCondicionIva = elementoCondicionIva;
            this.es_afip = es_afip;
    }
}