import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { FacturacionService } from './../../../../../services/facturacion.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-comprobante-afip',
  templateUrl: './buscar-comprobante-afip.component.html',
  styleUrls: ['./buscar-comprobante-afip.component.css']
})
export class BuscarComprobanteAfipComponent implements OnInit {

  cols: any[];
  loading: boolean;
  numero: string;
  element: any = null;
  constructor(private facturacionService:FacturacionService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) { 
    this.cols = [
      {field: 'descripcion', header: 'Descripcion',   width: '70%'  },
      { field: 'factura_alicuota_descripcion', header: 'Alícuota' ,  width: '10%'  },
      { field: 'cantidad', header: 'Cantidad' ,  width: '10%'  },
      { field: 'importe', header: 'Importe' ,  width: '%'  },
      


   ];
  

    
  }

  ngOnInit() {
    
  }


  buscarFacturaAfip() {


    try {
      this.facturacionService.GetVoucherInfo(this.config.data._pto_vta, this.numero, this.config.data.comprobante_id, this.config.data.medico_id)
      .subscribe(resp => {
        
        this.element = resp;
        console.log(this.element);
      },
      error => { // error path


          console.log(error);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            text: error,
            title: 'Algo no esta bien....',
            showConfirmButton: true,          
          });
       });    
  } catch (error) {
  
  }  
  
  
  }
  

}
