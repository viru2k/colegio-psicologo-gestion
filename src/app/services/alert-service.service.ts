import { Injectable } from '@angular/core';

import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }


throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string) {
  let tipoerror:string;

  if (estado== 'success') {
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        })
  }

  if (estado== 'warning') {
    swal({
        type: 'warning',
        title: motivo,
        text: mensaje
      })
}

  if (errorNumero === '422') {
    mensaje = 'Los datos que esta tratando de guardar son iguales a los que ya poseia';
    swal({   
        type: 'warning',
        title: 'Atención..',
        text: mensaje,
        footer: motivo
      })
}
  
  if ((estado== 'error')&&(errorNumero!='422')) {
    if (errorNumero === '422') {
        mensaje = 'Los datos que esta tratando de guardar son iguales a los que ya poseia';
    }
    if (errorNumero === '400 ') {
        mensaje = 'Bad Request ';
    }
    if (errorNumero === '404') {
        mensaje = 'No encontrado ';
    }
    if (errorNumero === '401') {
        mensaje = 'Sin autorización';
    }
    if (errorNumero === '403') {
        // tslint:disable-next-line: max-line-length
        mensaje = ' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
    }
    if (errorNumero === '405') {
        mensaje = 'Método no permitido';
    }
    if (errorNumero === '500') {
        mensaje = 'Error interno en el servidor';
    }
    if (errorNumero === '503') {
        mensaje = 'Servidor no disponible';
    }
    if (errorNumero === '502') {
        mensaje = 'Bad gateway';
    }

    swal({
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        });
  }


}

}


