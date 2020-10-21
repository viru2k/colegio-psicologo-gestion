import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatriculaGeneralComponent } from './pages/matricula/matricula-general/matricula-general.component';
import { NotFoundComponent } from './pages/info/not-found/not-found.component';
import { UsuarioComponent } from './pages/mantenimiento/usuario/usuario.component';
import { EmptyComponent } from './pages/info/empty/empty.component';
import { ObraSocialComponent } from './pages/mantenimiento/obra-social/obra-social.component';
import { PmoComponent } from './pages/mantenimiento/pmo/pmo.component';
import { ConvenioComponent } from './pages/mantenimiento/convenio/convenio.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ConceptoMatriculaComponent } from './pages/mantenimiento/concepto-matricula/concepto-matricula.component';

import { ChildRoutesModule } from './pages/child-routes.module';
import { ListadoCajaComponent } from './pages/movimiento-caja/listado-caja/listado-caja.component';
import { MovimientoCuentaComponent } from './pages/mantenimiento/movimiento-caja/movimiento-cuenta/movimiento-cuenta.component';
// tslint:disable-next-line: max-line-length
import { MovimientoConceptoCuentaComponent } from './pages/mantenimiento/movimiento-caja/movimiento-concepto-cuenta/movimiento-concepto-cuenta.component';
// tslint:disable-next-line: max-line-length
import { MovimientoTipoComprobanteComponent } from './pages/mantenimiento/movimiento-caja/movimiento-tipo-comprobante/movimiento-tipo-comprobante.component';
// tslint:disable-next-line: max-line-length
import { MovimientoTipoMonedaComponent } from './pages/mantenimiento/movimiento-caja/movimiento-tipo-moneda/movimiento-tipo-moneda.component';
import { MatriculaCobroComponent } from './pages/matricula/matricula-cobro/matricula-cobro.component';
import { MatriculaCajaComponent } from './pages/matricula/matricula-caja/matricula-caja.component';
import { FacturaElectronicaComponent } from './pages/factura/factura-electronica/factura-electronica.component';
import { OtrasAccionesComponent } from './pages/factura/otras-acciones/otras-acciones.component';

const routes: Routes = [



  { path: 'login', component: LoginComponent },
  { path: '404', component: NotFoundComponent },
  { path: '',
    component: NavbarComponent,
    children: [
/* -------------------------------------------------------------------------- */
/*                                  MATRICULA                                 */
/* -------------------------------------------------------------------------- */

  { path: 'configuracion/usuario', component: UsuarioComponent },
  { path: 'obrasocial/obra/social', component: ObraSocialComponent },
  { path: 'obrasocial/pmo', component: PmoComponent },
  { path: 'obrasocial/convenio', component: ConvenioComponent },
  { path: 'matricula', component: MatriculaGeneralComponent },
  { path: 'matricula/cobro', component: MatriculaCobroComponent },
  { path: 'matricula/caja', component: MatriculaCajaComponent },


  /* -------------------------------------------------------------------------- */
  /*                                MANTENIMIENTO                               */
  /* -------------------------------------------------------------------------- */

    { path: 'configuracion/usuario', component: UsuarioComponent },
    { path: 'configuracion/obra/social', component: ObraSocialComponent },
    { path: 'configuracion/pmo', component: PmoComponent },
    { path: 'configuracion/convenio', component: ConvenioComponent },
    { path: 'configuracion/concepto', component: ConceptoMatriculaComponent },

    { path: 'configuracion/caja/cuenta', component: MovimientoCuentaComponent },
    { path: 'configuracion/caja/concepto/cuenta', component: MovimientoConceptoCuentaComponent },
    { path: 'configuracion/caja/comprobante', component: MovimientoTipoComprobanteComponent },
    { path: 'configuracion/caja/moneda', component: MovimientoTipoMonedaComponent },


/* -------------------------------------------------------------------------- */
/*                                    CAJA                                    */
/* -------------------------------------------------------------------------- */

{ path: 'movimiento/caja', component: ListadoCajaComponent },
{ path: 'factura/electronica', component: FacturaElectronicaComponent },
{ path: 'factura/electronica/otras/acciones', component: OtrasAccionesComponent },


  /* -------------------------------------------------------------------------- */
  /*                                    OTROS                                   */
  /* -------------------------------------------------------------------------- */
    ]
 },
  { path: '**', component: NavbarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],







exports: [RouterModule]
})
export class AppRoutingModule { }
