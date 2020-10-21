import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MovimientoCajaService {


  private url: string  = URL_SERVICIOS ;

  constructor(public http: HttpClient) { }

  getMovimientoConceptoCuentas() {
  return this.http.get<any[]>(this.url + 'movimiento/concepto/cuentas');
  }

  getMovimientoConceptoCuenta(id: number) {
  return this.http.get<any>(this.url + 'movimiento/concepto/cuenta?id=' + id);
  }

  setMovimientoConceptoCuenta(data: any) {
  return this.http.post<any>(this.url + 'movimiento/concepto/cuenta', data);
  }

  putMovimientoConceptoCuenta(data: any, id: string) {

  return this.http.put<any>(this.url + 'movimiento/concepto/cuenta/' + id, data);
}


  getMovimientoConceptoTipoComprobantes() {
  return this.http.get<any[]>(this.url + 'movimiento/concepto/comprobantes');
  }

  getMovimientoConceptoTipoComprobante(id: number) {
  return this.http.get<any>(this.url + 'movimiento/concepto/comprobante?id=' + id);
  }

  setMovimientoConceptoTipoComprobante(data: any) {
  return this.http.post<any>(this.url + 'movimiento/concepto/comprobante', data);
  }

  putMovimientoConceptoTipoComprobante(data: any, id: string) {

  return this.http.put<any>(this.url + 'movimiento/concepto/comprobante/' + id, data);
}



getMovimientoConceptoMonedas() {
  return this.http.get<any[]>(this.url + 'movimiento/concepto/monedas');
  }

  getMovimientoConceptoMoneda(id: number) {
  return this.http.get<any>(this.url + 'movimiento/concepto/moneda?id=' + id);
  }

  setMovimientoConceptoMoneda(data: any) {
  return this.http.post<any>(this.url + 'movimiento/concepto/moneda', data);
  }

  putMovimientoConceptoMoneda(data: any, id: string) {

  return this.http.put<any>(this.url + 'movimiento/concepto/moneda/' + id, data);
}


getMovimientoCuentas() {
  return this.http.get<any[]>(this.url + 'movimiento/cuentas');
  }

  getMovimientoCuenta(id: number) {
  return this.http.get<any>(this.url + 'movimiento/cuenta?id=' + id);
  }

  setMovimientoCuenta(data: any) {
  return this.http.post<any>(this.url + 'movimiento/cuenta', data);
  }

  putMovimientoCuenta(data: any, id: string) {

  return this.http.put<any>(this.url + 'movimiento/cuenta/' + id, data);
}

geRegistroMovimientoBydate(fechaDesde : string , fechaHasta: string) {
  return this.http.get<any>(this.url + 'movimiento/registro/by/date?fecha_desde=' + fechaDesde + '&fecha_hasta= ' + fechaHasta);
  }


setMovimientoCaja(data: any) {
  return this.http.post<any>(this.url + 'movimiento/caja', data);
  }

  putMovimientoCaja(data: any, id: string) {

    return this.http.put<any>(this.url + 'movimiento/caja/' + id, data);
  }

/* -------------------------------------------------------------------------- */
/*                PROVEEDOR - AQUI POR UNA CUESTION DE AGILIDAD               */
/* -------------------------------------------------------------------------- */



getProveedores() {
  return this.http.get<any[]>(this.url + 'proveedores');
  }

  getProveedor(id: number) {
  return this.http.get<any>(this.url + 'proveedor?id=' + id);
  }

  setProveedor(data: any) {
  return this.http.post<any>(this.url + 'proveedor', data);
  }

  putProveedor(data: any, id: string) {

  return this.http.put<any>(this.url + 'proveedor/' + id, data);
}

}
