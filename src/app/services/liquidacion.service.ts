import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
import { URL_SERVICIOS, PARAMS } from "../config/config";

@Injectable({
  providedIn: "root",
})
export class LiquidacionService {
  private url: string = URL_SERVICIOS + "liquidacion";

  constructor(public http: HttpClient) {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  getListadoPreFactura(selected: any) {
    return this.http.post<any[]>(this.url + "/detalle/prefactura", selected);
  }

  getListadoPreFacturaCirugia(selected: any) {
    return this.http.post<any[]>(
      this.url + "/detalle/prefactura/cirugia",
      selected
    );
  }

  getListadoPreFacturaCirugiaCoseguro(selected: any) {
    return this.http.post<any[]>(
      this.url + "/detalle/prefactura/cirugia/coseguro",
      selected
    );
  }

  generarTxt(selected: any) {
    return this.http.post<any[]>(
      URL_SERVICIOS + "multiuploads/texto",
      selected
    );
  }

  generarTxtCirugia(selected: any) {
    return this.http.post<any[]>(
      URL_SERVICIOS + "multiuploads/texto/cirugia",
      selected
    );
  }

  GetDistribucionByNumero(id: string) {
    return this.http.get<any>(
      URL_SERVICIOS + "operacioncobro/distribucion/numero?id=" + id
    );
  }

  generarLiquidacionNumero(liquidacion) {
    console.log(liquidacion);
    return this.http.post<any>(
      URL_SERVICIOS + "operacioncobro/liquidacion/generdada/id",
      liquidacion
    );
  }

  getOrdenByMatriculaAndLiquidacion(
    mat_matricula: string,
    id_liquidacion: string
  ) {
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/orden/by/matricula/liquidacion?mat_matricula=" +
        mat_matricula +
        "&id_liquidacion=" +
        id_liquidacion
    );
  }

  getLiquidacionOrdenByExpediente(id_os_liquidacion: string) {
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/orden/by/expediente?id_os_liquidacion=" +
        id_os_liquidacion
    );
  }

  getLiquidacionNumero(id: string) {
    return this.http.get<any>(
      URL_SERVICIOS + "operacioncobro/liquidacion/generdada?id=" + id
    );
  }

  setOrden(orden: any) {
    return this.http.post<any[]>(URL_SERVICIOS + "liquidacion/orden", orden);
  }

  getLiquidaciones() {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(URL_SERVICIOS + "liquidacion/generada");
  }

  getLiquidacionDetalleByidLiquidacion(id_liquidacion_generada: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS +
        "liquidacion/detalle/by/id/liquidacion?id_liquidacion_generada=" +
        id_liquidacion_generada
    );
  }

  getLiquidacionDetalleByMatricula(mat_matricula: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS +
        "liquidacion/detalle/by/matricula?mat_matricula=" +
        mat_matricula
    );
  }

  getActuacionProfesionalByMatricula(mat_matricula: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS +
        "liquidacion/actuacion/profesional?mat_matricula=" +
        mat_matricula
    );
  }

  getLiquidacionByMatriculaAndEstado(matMatricula: string, estado: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/orden/by/estado/matricula?mat_matricula=" +
        matMatricula +
        "&estado=" +
        estado
    );
  }

  getLiquidacionOrdenBetweenDates(
    fechaDesde: string,
    fechaHasta: string,
    estado: string
  ) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/orden/by/dates/estado?fecha_desde=" +
        fechaDesde +
        "&fecha_hasta=" +
        fechaHasta +
        "&estado=" +
        estado
    );
  }

  auditarOrdenes(elementos: any) {
    return this.http.post<any[]>(
      URL_SERVICIOS + "liquidacion/orden/auditar",
      elementos
    );
  }

  afectarOrdenes(
    elementos: any,
    fecha_desde: string,
    fecha_hasta: string,
    id_os_obra_social: string,
    os_liq_numero: number,
    total_ordenes: number,
    total: number
  ) {
    return this.http.post<any[]>(
      URL_SERVICIOS +
        "liquidacion/expediente/afectar?fecha_desde=" +
        fecha_desde +
        "&fecha_hasta=" +
        fecha_hasta +
        "&estado=AFE" +
        "&id_os_obra_social=" +
        id_os_obra_social +
        "&os_liq_numero=" +
        os_liq_numero +
        "&total_ordenes=" +
        total_ordenes +
        "&total=" +
        total,
      elementos
    );
  }

  putExpediente(elementos: any, id_os_liquidacion: string) {
    return this.http.put<any>(
      URL_SERVICIOS + "liquidacion/expediente/actualizar/" + id_os_liquidacion,
      elementos
    );
  }

  putLiquidacionDetalle(elementos: any, id_liquidacion_detalle: string) {
    return this.http.put<any>(
      URL_SERVICIOS + "liquidacion/registro/detalle/" + id_liquidacion_detalle,
      elementos
    );
  }

  putLiquidacion(elementos: any, id_os_liquidacion: string) {
    return this.http.put<any>(
      URL_SERVICIOS + "liquidacion/registro/liquidacion/" + id_os_liquidacion,
      elementos
    );
  }

  putActualizarValoresExpediente(id_os_liquidacion: string) {
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/expediente/valores?id_os_liquidacion=" +
        id_os_liquidacion
    );
  }

  putOrden(elementos: any, id_os_liquidacion: string) {
    return this.http.put<any>(
      URL_SERVICIOS + "liquidacion/orden/" + id_os_liquidacion,
      elementos
    );
  }

  desafectarExpediente(os_liq_numero: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/expediente/desafectar?os_liq_numero=" +
        os_liq_numero
    );
  }

  getExpedienteByEstado(estado: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS + "liquidacion/expediente/estado?estado=" + estado
    );
  }

  getExpedienteByIdLIquidacion(idLiquidacion: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS +
        "liquidacion/expediente/liquidacion/id?id_liquidacion=" +
        idLiquidacion
    );
  }

  generarLiquidacion(
    id_liquidacion: number,
    os_fecha: string,
    elementos: any[]
  ) {
    // tslint:disable-next-line: max-line-length
    return this.http.post<any[]>(
      URL_SERVICIOS +
        "liquidacion/expediente/liquidacion/generar?id_liquidacion=" +
        id_liquidacion +
        "&os_fecha=" +
        os_fecha,
      elementos
    );
  }

  calcularBruto(idLiquidacion: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS +
        "liquidacion/calcular/bruto?id_liquidacion=" +
        idLiquidacion
    );
  }

  liquidar(id_liquidacion_generada: any, descuenta_matricula: string) {
    console.log("liquidando");
    // tslint:disable-next-line: max-line-length
    return this.http.get(
      URL_SERVICIOS +
        "liquidacion/liquidar?id_liquidacion_generada=" +
        id_liquidacion_generada
    );
  }

  getUltimoIngresoBruto() {
    // tslint:disable-next-line: max-line-length
    this.http.get(URL_SERVICIOS + "liquidacion/ingreso/bruto/ultimo");
  }

  destroyOrdenById(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.delete<any>(URL_SERVICIOS + "orden/eliminar/" + id);
  }

  obtenerLiquidacionDetalleSeleccionadas(id_liquidacion_generada: any[]) {
    // tslint:disable-next-line: max-line-length
    this.http.post(
      URL_SERVICIOS + "liquidacion/expediente/liquidacion/id/seleccionado",
      id_liquidacion_generada
    );
  }

  getObrasSocialesByLiquidacion(id_liquidacion_generada: any) {
    console.log("liquidando");
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      URL_SERVICIOS +
        "liquidacion/obrasocial/detalle?id_liquidacion_generada=" +
        id_liquidacion_generada
    );
  }

  getUltimoNroIngBrutos(id_liquidacion_generada: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/ultimonumero/ingbrutos?id_liquidacion_generada=" +
        id_liquidacion_generada
    );
  }

  getUltimoNroRecibo(id_liquidacion_generada: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(
      URL_SERVICIOS +
        "liquidacion/ultimonumero/recibo?id_liquidacion_generada=" +
        id_liquidacion_generada
    );
  }

  putActualizarNroIngBrutos(elem, proximoNumero: number) {
    return this.http.post(
      URL_SERVICIOS +
        "liquidacion/actualizar/ingbrutos?proximo_numero=" +
        proximoNumero,
      elem
    );
  }

  putActualizarNroRecibo(elem, proximoNumero: number) {
    return this.http.post(
      URL_SERVICIOS +
        "liquidacion/actualizar/recibo?proximo_numero=" +
        proximoNumero,
      elem
    );
  }

  createTextFileDos(elementos: any) {
    return this.http.post<any[]>(
      URL_SERVICIOS + "files/dos/by/excel",
      elementos
    );
  }

  createTextFileIngBrutos(id_liquidacion_generada: string) {
    return this.http.get<any>(
      URL_SERVICIOS +
        "files/rentas/by/liquidacion?id_liquidacion_generada=" +
        id_liquidacion_generada
    );
  }

  getPadronDeudaByDate(
    fecha: string,
    fecha_desde: string,
    fecha_hasta: string,
    condicion: string
  ) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(
      URL_SERVICIOS +
        "informe/deuda/psicologo?fecha=" +
        fecha +
        "&fecha_desde=" +
        fecha_desde +
        "&fecha_hasta=" +
        fecha_hasta +
        "&condicion=" +
        condicion
    );
  }
}
