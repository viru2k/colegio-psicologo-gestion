import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatriculaGeneralComponent } from './pages/matricula/matricula-general/matricula-general.component';
import { NotFoundComponent } from './pages/info/not-found/not-found.component';
import { UsuarioComponent } from './pages/mantenimiento/usuario/usuario.component';
import { EmptyComponent } from './pages/info/empty/empty.component';
import { ObraSocialComponent } from './pages/mantenimiento/obra-social/obra-social.component';
import { PmoComponent } from './pages/mantenimiento/pmo/pmo.component';
import { ConvenioComponent } from './pages/mantenimiento/convenio/convenio.component';

const routes: Routes = [

/* -------------------------------------------------------------------------- */
/*                                  MATRICULA                                 */
/* -------------------------------------------------------------------------- */

  { path: 'matricula', component: MatriculaGeneralComponent },


/* -------------------------------------------------------------------------- */
/*                                MANTENIMIENTO                               */
/* -------------------------------------------------------------------------- */

  { path: 'usuario', component: UsuarioComponent },
  { path: 'mantenimiento/obra/social', component: ObraSocialComponent },
  { path: 'mantenimiento/pmo', component: PmoComponent },
  { path: 'mantenimiento/convenio', component: ConvenioComponent },

/* -------------------------------------------------------------------------- */
/*                                    OTROS                                   */
/* -------------------------------------------------------------------------- */


  { path: 'inicio', component: EmptyComponent },
  { path: '404', component: NotFoundComponent },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],




exports: [RouterModule]
})
export class AppRoutingModule { }
