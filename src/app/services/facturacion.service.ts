import { ReciboEncabezadoCaja } from "./../models/recibo-encabezado-caja-model";
import { ReciboEncabezado } from "./../models/recibo-encabezado.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { URL_SERVICIOS, PARAMS } from "../config/config";
import { FacturaElectronica } from "./../models/factura-electronica.model";

@Injectable({
  providedIn: "root",
})
export class FacturacionService {
  private url: string = URL_SERVICIOS;

  constructor(public http: HttpClient) {}

  /******DATOS SOBRE FACTURACION******/

  GetVoucherInfo(
    punto_vta: string,
    comprobante_numero: string,
    comprobante_id: number,
    medico_id: string
  ) {
    return this.http.get<number>(
      this.url +
        "afip/factura/info?punto_vta=" +
        punto_vta +
        "&comprobante_numero=" +
        comprobante_numero +
        "&comprobante_id=" +
        comprobante_id +
        "&medico_id=" +
        medico_id
    );
  }

  GetLastVoucher(
    punto_vta: string,
    comprobante_tipo: string,
    medico_id: string
  ) {
    return this.http.get<number>(
      this.url +
        "afip/data/getlastvoucher?punto_vta=" +
        punto_vta +
        "&comprobante_tipo=" +
        comprobante_tipo +
        "&medico_id=" +
        medico_id
    );
  }

  getIformacionComprobante(
    punto_vta: string,
    comprobante_tipo: string,
    medico_id: string,
    comprobante_nro: string
  ) {
    return this.http.get<any[]>(
      this.url +
        "afip/data/getiformacioncomprobante?punto_vta=" +
        punto_vta +
        "&comprobante_nro=" +
        comprobante_tipo +
        "&medico_id=" +
        medico_id +
        "&comprobante_tipo=" +
        comprobante_tipo
    );
  }

  TipoComprobantesDisponibles(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/tipocomprobantesdisponibles?medico_id=" + medico_id
    );
  }

  TipoConceptosDisponibles(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/tipoconceptosdisponibles?medico_id=" + medico_id
    );
  }

  TipoDocumentosDisponibles(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/tipodocumentosdisponibles?medico_id=" + medico_id
    );
  }

  TipoAlicuotasDisponibles(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/tipoalicuotasdisponibles?medico_id=" + medico_id
    );
  }

  GetOptionsTypes(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/getoptionstypes?medico_id=" + medico_id
    );
  }

  ObetenerEstadoDelServidor(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/obetenerestadodelservidor?medico_id=" + medico_id
    );
  }

  getDatoMedico(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/data/medico/dato?medico_id=" + medico_id
    );
  }

  /******REALIZACION DE FACTURACION******/

  testAfipGetLastVoucher(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/lastvoucher?medico_id=" + medico_id
    );
  }

  CrearFacturaA(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/factura/a?medico_id=" + medico_id
    );
  }

  CrearFacturaB(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/factura/b?medico_id=" + medico_id
    );
  }

  CrearFacturaC(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/factura/c?medico_id=" + medico_id
    );
  }

  CrearNotaCreditoA(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/notacredito/a?medico_id=" + medico_id
    );
  }

  CrearNotaCreditoB(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/notacredito/b?medico_id=" + medico_id
    );
  }

  CrearNotaCreditoC(medico_id: string) {
    return this.http.get<any[]>(
      this.url + "afip/notacredito/c?medico_id=" + medico_id
    );
  }

  /******************************************************************* */
  // ELEMENTOS DE LA FACTURA
  /******************************************************************* */

  Alicuota() {
    return this.http.get<any[]>(this.url + "afip/elementos/alicuota");
  }

  AlicuotaAsociada() {
    return this.http.get<any[]>(this.url + "afip/elementos/alicuota/asociada");
  }

  Comprobante() {
    return this.http.get<any[]>(this.url + "afip/elementos/comprobante");
  }

  Concepto() {
    return this.http.get<any[]>(this.url + "afip/elementos/concepto");
  }

  Documento() {
    return this.http.get<any[]>(this.url + "afip/elementos/documento");
  }

  PtoVta() {
    return this.http.get<any[]>(this.url + "afip/elementos/pto/vta");
  }

  CategoriaIva() {
    return this.http.get<any[]>(this.url + "afip/elementos/categoria/iva");
  }

  GetFacturaByid() {
    return this.http.get<any[]>(this.url + "afip/elementos/factura");
  }

  crearFactura(facturaElectronica: FacturaElectronica) {
    return this.http.post<any>(
      this.url + "afip/elementos/factura/nueva",
      facturaElectronica
    );
  }

  GetFacturaByArticuloTipo() {
    return this.http.get<any[]>(this.url + "afip/elementos/articulo/tipo");
  }

  FacturaArticulo() {
    return this.http.get<any[]>(this.url + "afip/elementos/articulo");
  }

  crearFacturaNotaCredito(facturaElectronica: FacturaElectronica) {
    return this.http.post<any>(
      this.url + "afip/elementos/factura/nota/credito",
      facturaElectronica
    );
  }

  getMedicosFacturan() {
    return this.http.get<any[]>(this.url + "afip/data/medicos/facturan");
  }

  GetFacturaBetweenDates(fecha_desde: string, fecha_hasta: string) {
    return this.http.get<any[]>(
      this.url +
        "afip/elementos/factura/by/fecha?fecha_desde=" +
        fecha_desde +
        "&fecha_hasta=" +
        fecha_hasta
    );
  }

  GetFacturaBetweenDatesMatricula(fecha_desde: string, fecha_hasta: string) {
    return this.http.get<any[]>(
      this.url +
        "afip/elementos/factura/by/fecha?fecha_desde=" +
        fecha_desde +
        "&fecha_hasta=" +
        fecha_hasta +
        "&filtro=" +
        "MATRICULA"
    );
  }

  GetFacturaByNameOrDocumento(factura_documento: string) {
    return this.http.get<any[]>(
      this.url +
        "afip/elementos/factura/by/cliente?factura_cliente=" +
        factura_documento +
        "&factura_documento=" +
        factura_documento
    );
  }

  GetFacturaById(factura_numero: string) {
    return this.http.get<any[]>(
      this.url + "afip/elementos/factura/by/id?factura_numero=" + factura_numero
    );
  }

  getLibroIva(fecha_desde: string, fecha_hasta: string, medico_id: string) {
    return this.http.get<any[]>(
      this.url +
        "afip/elementos/factura/libro/iva?fecha_desde=" +
        fecha_desde +
        "&fecha_hasta=" +
        fecha_hasta +
        "&medico_id=" +
        medico_id
    );
  }
  crearReciboCobro(reciboElectronico: ReciboEncabezado) {
    return this.http.post<any>(
      this.url + "afip/recibo/cobrar",
      reciboElectronico
    );
  }

  crearCajaCobro(reciboElectronico: ReciboEncabezadoCaja) {
    return this.http.post<any>(
      this.url + "afip/caja/cobrar",
      reciboElectronico
    );
  }
}
