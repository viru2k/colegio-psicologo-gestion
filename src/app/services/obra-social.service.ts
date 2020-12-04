import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from './../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {


  private url: string  = URL_SERVICIOS;

  constructor(public http: HttpClient) { }

  getObraSocial() {
  return this.http.get<any[]>(this.url + 'obra/social');
  }

  getObraSocialHabilitado() {
    return this.http.get<any[]>(this.url + 'obra/social/habilitada');
  }

  putObraSocial(val: any, id: string) {
  return this.http.put<any>(this.url + 'obra/social/' + id, val);
}

  settObraSocial(val: any[]) {
  return this.http.post<any>(this.url + 'obra/social' , val);
}

getConvenioByObraSocial(obraSocialId: string) {
  return this.http.get<any[]>(this.url + 'obra/social/convenio?obra_social_id=' + obraSocialId);
  }

  getConvenioByObraSocialHabilitada() {
    return this.http.get<any[]>(this.url + 'obra/social/convenio/habilitada');
    }


  getConvenioHabilitada() {
    return this.http.get<any[]>(this.url + 'convenio/habilitada');
    }

    putConvenio(val: any, id: string) {
         return this.http.put<any>(this.url + 'convenio/' + id, val);
    }

      setConvenio(val: any[]) {
          return this.http.post<any>(this.url + 'convenio' , val);
    }

}
