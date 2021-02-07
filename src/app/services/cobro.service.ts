import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { URL_SERVICIOS, PARAMS } from "../config/config";
import { PlanPago } from "../models/plan-pago.model";

@Injectable({
  providedIn: "root",
})
export class CobroService {
  private url: string = URL_SERVICIOS;

  constructor(public http: HttpClient) {}

  getDeudaByMatricula(matMatricula: string) {
    return this.http.get<any[]>(
      this.url + "cobro/by/matricula?mat_matricula=" + matMatricula
    );
  }

  getDeudaByMatriculaAndEstado(matMatricula: string, estado: string) {
    return this.http.get<any[]>(
      this.url +
        "cobro/by/matricula/estado?mat_matricula=" +
        matMatricula +
        "&estado=" +
        estado
    );
  }

  getDeudaByMatriculaAndEstadoByIdLiquidacionDetalle(
    matMatricula: string,
    estado: string,
    id_liquidacion_detalle: string
  ) {
    return this.http.get<any[]>(
      this.url +
        "cobro/by/matricula/estado/detalle/liquidacion?mat_matricula=" +
        matMatricula +
        "&estado=" +
        estado +
        "&id_liquidacion_detalle=" +
        id_liquidacion_detalle
    );
  }

  getDeudaByPlanAndMatricula(matMatricula: string, matIdPlan: string) {
    return this.http.get<any[]>(
      this.url +
        "cobro/by/matricula/plan?mat_matricula=" +
        matMatricula +
        "&mat_id_plan=" +
        matIdPlan
    );
  }

  getPlanes() {
    return this.http.get<any[]>(this.url + "cobro/plan");
  }

  getDeudaBydMatriculaBetweenDates(
    fechaDesde: string,
    fechaHasta: string,
    estado: string
  ) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(
      this.url +
        "cobro/by/matricula/by/dates?fecha_desde=" +
        fechaDesde +
        "&fecha_hasta=" +
        fechaHasta +
        "&estado=" +
        estado
    );
  }

  setDeuda(element: any) {
    return this.http.post<any>(this.url + "cobro/by/matricula", element);
  }

  setDeudaRegistros(element: any) {
    return this.http.post<any>(
      this.url + "cobro/by/matricula/registros/nuevos",
      element
    );
  }

  putDeuda(element: any, id: string) {
    return this.http.put<any>(
      this.url + "cobro/by/matricula/actualizar/" + id,
      element
    );
  }

  putRegistroCobro(element: any, id: string) {
    return this.http.put<any>(
      this.url + "cobro/by/matricula/cobrar/" + id,
      element
    );
  }

  getConcepto() {
    return this.http.get<any[]>(this.url + "concepto");
  }

  setConcepto(element: any) {
    return this.http.post<any>(this.url + "concepto", element);
  }

  putConcepto(element: any, id: string) {
    return this.http.put<any>(this.url + "concepto/" + id, element);
  }

  getUltimoPlanPago() {
    return this.http.get<any>(this.url + "plan/ultimo");
  }

  setPlanPagoMatricula(element: PlanPago) {
    return this.http.post<any>(this.url + "plan/by/matricula", element);
  }

  generarDeudaPsicologo(
    mat_matricula_psicologo: string,
    anio: string,
    consulta: string
  ) {
    return this.http.get<any>(
      this.url +
        "deuda/psicologo?mat_matricula_psicologo=" +
        mat_matricula_psicologo +
        "&anio=" +
        anio +
        "&consulta=" +
        consulta
    );
  }

  putRegistroCobroEliminado(id_pago_historico: string, id_usuario: string) {
    return this.http.get<any>(
      this.url +
        "cobro/registro/eliminar?id_pago_historico=" +
        id_pago_historico +
        "&id_usuario=" +
        id_usuario
    );
  }
}
