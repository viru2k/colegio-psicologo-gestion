import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {

  elementosPagina: any[] = [];
  elementoPagina: any = null;
  descripcion: any;
  titulo = '';
  tipo = 'PRIVADO';
  constructor() {

    this.elementosPagina = [
      {name: 'INICIO', code: 'INICIO'},
      {name: 'ASUNTOSPROFESIONALES', code: 'ASUNTOSPROFESIONALES'},
      {name: 'TESORERIA', code: 'TESORERIA'},
      {name: 'REVISORES', code: 'REVISORES'},
      {name: 'SECRETARIAGENERAL', code: 'SECRETARIAGENERAL'},
      {name: 'SOCIAL', code: 'SOCIAL'}
  ];
   }

  ngOnInit() {
  }

  
  changeElementoPagina(event) {
    console.log(event.value);
    this.elementoPagina = event.value;
  }

  textoModificado(event: any) {

    this.descripcion =  event.htmlValue;
  }

  enviarNoticia() {
    console.log(this.descripcion);
  }
}
