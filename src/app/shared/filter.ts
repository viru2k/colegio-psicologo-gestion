
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
@Injectable({
    providedIn: 'root'
  })
export class Filter {


public filterArray(arr: any) {
    //const uniqueArray = new Set(arr);
   // const backToArray =[...uniqueArray];
   let result = [];
   let i = 0;
    const temp = Array.from(new Set(arr));
    temp.forEach(element => {
      result.push(  {label: element, value: element});
      i++;
    });
    return result;
   }


   /* -------------------------------------------------------------------------- */
   /*            FUNCION QUE COMPARA FECHAS Y DEVUELVE NUMERO DE MESES           */
   /* -------------------------------------------------------------------------- */

   public  monthdiff(vencimiento) {
     const today = new Date();

     const _vencimiento =  new Date(vencimiento);
     let d1 = today;
     let d2 = _vencimiento;
   if (today < _vencimiento) {
     d1 = _vencimiento;
     d2 = today;
    }

    let m = (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
     if (d1.getDate()<d2.getDate()) { --m; }
   //	return m;
   //console.log(m);
   return m;
   }


   public monthDiffByDates(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}


/* -------------------------------------------------------------------------- */
/*                             INCREMENTO LA FECHA                            */
/* -------------------------------------------------------------------------- */

public getFechaAfterMonth(i: number ) {
  const newDate  =  formatDate(new Date(new Date().setMonth(new Date().getMonth() + i  )), 'yyyy-MM-dd', 'en')  ;
  return newDate;
}
/* -------------------------------------------------------------------------- */
/*                             COMPLETO CON CEROS                             */
/* -------------------------------------------------------------------------- */
padLeft(text:string, padChar:string, size:number): string {
// padLeft(String(resp),'0',8)

  return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
}


}
