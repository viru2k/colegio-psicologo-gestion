
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { URL_SERVICIOS, PARAMS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

  private url: string  = URL_SERVICIOS + 'liquidacion';

  constructor(public http: HttpClient) { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }


  getListadoPreFactura(selected: any) {
    return this.http.post<any[]>(this.url + '/detalle/prefactura', selected);
    }

  getListadoPreFacturaCirugia(selected: any) {
    return this.http.post<any[]>(this.url + '/detalle/prefactura/cirugia', selected);
    }

    getListadoPreFacturaCirugiaCoseguro(selected: any) {
      return this.http.post<any[]>(this.url + '/detalle/prefactura/cirugia/coseguro', selected);
      }

  generarTxt(selected: any) {
    return this.http.post<any[]>(URL_SERVICIOS + 'multiuploads/texto', selected);
    }

    generarTxtCirugia(selected: any) {
      return this.http.post<any[]>(URL_SERVICIOS + 'multiuploads/texto/cirugia', selected);
      }

      GetDistribucionByNumero(id: string) {
      return this.http.get<any>(URL_SERVICIOS + 'operacioncobro/distribucion/numero?id=' + id);
      }

    generarLiquidacionNumero(liquidacion) {
      console.log(liquidacion);
      return this.http.post<any>(URL_SERVICIOS + 'operacioncobro/liquidacion/generdada/id', liquidacion);
    }


    getLiquidacionNumero(id: string) {
      return this.http.get<any>(URL_SERVICIOS + 'operacioncobro/liquidacion/generdada?id=' + id);
      }

      setOrden(orden: any) {
    return this.http.post<any[]>(URL_SERVICIOS + 'liquidacion/orden', orden);
    }

    getLiquidacionByMatriculaAndEstado(matMatricula: string, estado: string) {
      // tslint:disable-next-line: max-line-length
      return this.http.get<any>(URL_SERVICIOS + 'liquidacion/orden/by/estado/matricula?mat_matricula=' + matMatricula + '&estado=' + estado);
      }
}
