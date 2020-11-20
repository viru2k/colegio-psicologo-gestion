import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import { PlanPago } from '../models/plan-pago.model';

@Injectable({
  providedIn: 'root'
})
export class CobroService {

  private url: string  = URL_SERVICIOS;

  constructor(public http: HttpClient) { }

  getDeudaByMatricula(matMatricula: string) {
    return this.http.get<any[]>(this.url + 'cobro/by/matricula?mat_matricula=' + matMatricula);
  }

  getDeudaByMatriculaAndEstado(matMatricula: string , estado: string) {
    return this.http.get<any[]>(this.url + 'cobro/by/matricula/estado?mat_matricula=' + matMatricula + '&estado=' + estado);
  }

  getDeudaByPlanAndMatricula(matMatricula: string , matIdPlan: string) {
    return this.http.get<any[]>(this.url + 'cobro/by/matricula/plan?mat_matricula=' + matMatricula + '&mat_id_plan=' + matIdPlan);
  }

  getPlanes() {
    return this.http.get<any[]>(this.url + 'cobro/plan');
  }

  getDeudaBydMatriculaBetweenDates(fechaDesde: string, fechaHasta: string, estado: string ) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(this.url + 'cobro/by/matricula/by/dates?fecha_desde=' + fechaDesde + '&fecha_hasta=' + fechaHasta + '&estado=' + estado);
  }

  setDeuda(element: any) {
    return this.http.post<any>(this.url + 'cobro/by/matricula', element);
  }

  setDeudaRegistros(element: any) {
    return this.http.post<any>(this.url + 'cobro/by/matricula/registros/nuevos', element);
  }
  

  putDeuda(element: any, id: string) {
    return this.http.put<any>(this.url + 'cobro/by/matricula/actualizar/' + id, element);
  }

  putRegistroCobro(element: any, id: string) {

    return this.http.put<any>(this.url + 'cobro/by/matricula/cobrar/' + id, element);
  }

  


  getConcepto() {
    return this.http.get<any[]>(this.url + 'concepto');
  }

  setConcepto(element: any) {
    return this.http.post<any>(this.url + 'concepto', element);
  }

  putConcepto(element: any, id: string) {
    return this.http.put<any>(this.url + 'concepto/' + id, element);
  }

  getUltimoPlanPago() {
    return this.http.get<any>(this.url + 'plan/ultimo');
  }

  setPlanPagoMatricula(element: PlanPago) {
    return this.http.post<any>(this.url + 'plan/by/matricula', element);
  }

}
