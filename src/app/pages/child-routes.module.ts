import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { UsuarioComponent } from './mantenimiento/usuario/usuario.component';
import { ObraSocialComponent } from './mantenimiento/obra-social/obra-social.component';
import { PmoComponent } from './mantenimiento/pmo/pmo.component';
import { ConvenioComponent } from './mantenimiento/convenio/convenio.component';
import { MatriculaCajaComponent } from './matricula/matricula-caja/matricula-caja.component';
import { MatriculaCobroComponent } from './matricula/matricula-cobro/matricula-cobro.component';

 

const childRoutes: Routes = [
    
  { path: 'configuracion/usuario', component: UsuarioComponent },
  { path: 'obrasocial/obra/social', component: ObraSocialComponent },
  { path: 'obrasocial/pmo', component: PmoComponent },
  { path: 'obrasocial/convenio', component: ConvenioComponent },
]

@NgModule({
  declarations: [MatriculaCajaComponent, MatriculaCobroComponent],
  imports: [RouterModule.forChild(childRoutes)],
  

exports: [RouterModule]
})
export class ChildRoutesModule { }
