import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from './../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private url: string  = URL_SERVICIOS;

  constructor(public http: HttpClient) { }

getMatriculas() {
  return this.http.get<any[]>(this.url + 'matriculas');
  }

getMatricula(matriculaId: string) {
    return this.http.get<any>(this.url + 'matricula?matricula_id=' + matriculaId);
    }

    getPacienteByCondicion(pacDni: string, condicion: string) {
  return this.http.get<any>(this.url + 'paciente/by/condicion?pac_dni=' + pacDni + '&condicion=' + condicion);
  }

  getPacientes() {
    return this.http.get<any>(this.url + 'paciente/todos/limite' );
    }



getMatriculaObraSocial(matriculaId: string) {
    return this.http.get<any[]>(this.url + 'matricula/obra/social?matricula_id=' + matriculaId);
}


putMatricula(val: any, id: string) {

  return this.http.put<any>(this.url + 'matricula/' + id, val);
}

setMatricula(val: any[]) {

  return this.http.post<any>(this.url + 'matricula' , val);
}

delObraSocialMatricula(id: string) {
  return this.http.delete<string>(this.url + 'matricula/ ' + id);
  }

setObraSocialModulo(val: any[], id: string) {
    console.log(val);
    return this.http.post<any>(this.url + 'matricula/obra/social/add/' + id, val);
  }

  setPaciente(val: any[]) {

    return this.http.post<any>(this.url + 'paciente/nuevo', val);
  }

  putPaciente(val: any, id: string) {

    return this.http.put<any>(this.url + 'paciente/' + id, val);
  }

}
