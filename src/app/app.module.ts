import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, LocationStrategy, HashLocationStrategy, CurrencyPipe, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule  } from '@angular/common/http';


import { environment } from '../environments/environment';


/* -------------------------------------------------------------------------- */
/*                                  SERVICIOS                                 */
/* -------------------------------------------------------------------------- */

import { ExcelService } from './services/excel.service';
import { PushNotificationService } from './services/push-notification.service';

/* -------------------------------------------------------------------------- */
/*                             PRIME NG LIBRERIAS                             */
/* -------------------------------------------------------------------------- */

import {OrderListModule} from 'primeng/orderlist';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from 'primeng/inputmask';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {SpinnerModule} from 'primeng/spinner';
import {ToastModule} from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import {ListboxModule} from 'primeng/listbox';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {StepsModule} from 'primeng/steps';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TabViewModule} from 'primeng/tabview';





/* -------------------------------------------------------------------------- */
/*                            LIBRERIAS DE TERCEROS                           */
/* -------------------------------------------------------------------------- */

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { AutofocusModule } from 'angular-autofocus-fix';
import localeEsAR from '@angular/common/locales/es-AR';


/* -------------------------------------------------------------------------- */
/*                                 COMPONENTES                                */
/* -------------------------------------------------------------------------- */

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { EmptyComponent } from './pages/info/empty/empty.component';
import { NotFoundComponent } from './pages/info/not-found/not-found.component';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { PopupUsuarioComponent } from './shared/components/popups/popup-usuario/popup-usuario.component';
import { MatriculaGeneralComponent } from './pages/matricula/matricula-general/matricula-general.component';
// tslint:disable-next-line: max-line-length
import { PopupMatriculaObraSocialComponent } from './pages/matricula/popups/popup-matricula-obra-social/popup-matricula-obra-social.component';
import { PopupMatriculaEditarComponent } from './pages/matricula/popups/popup-matricula-editar/popup-matricula-editar.component';
import { UsuarioComponent } from './pages/mantenimiento/usuario/usuario.component';
import { UsuarioModuloComponent } from './pages/mantenimiento/usuario-modulo/usuario-modulo.component';
import { CustomPreloaderComponent } from './shared/components/custom-preloader/custom-preloader.component';
import { UsuarioEditarComponent } from './pages/mantenimiento/usuario-editar/usuario-editar.component';
import { ObraSocialComponent } from './pages/mantenimiento/obra-social/obra-social.component';
import { PmoComponent } from './pages/mantenimiento/pmo/pmo.component';
import { ConvenioComponent } from './pages/mantenimiento/convenio/convenio.component';
// tslint:disable-next-line: max-line-length
import { PopupObraSocialEditarComponent } from './pages/mantenimiento/obra-social/popup-obra-social-editar/popup-obra-social-editar.component';
import { PopupPmoEditarComponent } from './pages/mantenimiento/obra-social/popup-pmo-editar/popup-pmo-editar.component';
import { PopupConvenioEditarComponent } from './pages/mantenimiento/obra-social/popup-convenio-editar/popup-convenio-editar.component';
import { LoginComponent } from './login/login.component';
import { ConceptoMatriculaComponent } from './pages/mantenimiento/concepto-matricula/concepto-matricula.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';
import { ListadoCajaComponent } from './pages/movimiento-caja/listado-caja/listado-caja.component';
import { MovimientoCuentaComponent } from './pages/mantenimiento/movimiento-caja/movimiento-cuenta/movimiento-cuenta.component';
// tslint:disable-next-line: max-line-length
import { MovimientoConceptoCuentaComponent } from './pages/mantenimiento/movimiento-caja/movimiento-concepto-cuenta/movimiento-concepto-cuenta.component';
// tslint:disable-next-line: max-line-length
import { MovimientoTipoComprobanteComponent } from './pages/mantenimiento/movimiento-caja/movimiento-tipo-comprobante/movimiento-tipo-comprobante.component';
// tslint:disable-next-line: max-line-length
import { MovimientoTipoMonedaComponent } from './pages/mantenimiento/movimiento-caja/movimiento-tipo-moneda/movimiento-tipo-moneda.component';
import { PopupMovimientoComponent } from './pages/movimiento-caja/popup-movimiento/popup-movimiento.component';
import { PopupMovimientoConceptoCuentaEditarComponent } from './pages/mantenimiento/movimiento-caja/popup-movimiento-concepto-cuenta-editar/popup-movimiento-concepto-cuenta-editar.component';
import { PopupMovimientoCuentaEditarComponent } from './pages/mantenimiento/movimiento-caja/popup-movimiento-cuenta-editar/popup-movimiento-cuenta-editar.component';
import { PopupMovimientoTipoComprobanteEditarComponent } from './pages/mantenimiento/movimiento-caja/popup-movimiento-tipo-comprobante-editar/popup-movimiento-tipo-comprobante-editar.component';
import { PopupProveedorFindComponent } from './shared/components/popups/popup-proveedor-find/popup-proveedor-find.component';
import { FacturaElectronicaComponent } from './pages/factura/factura-electronica/factura-electronica.component';
import { OtrasAccionesComponent } from './pages/factura/otras-acciones/otras-acciones.component';

import { LoadingComponent } from './shared/components/loading/loading.component';
import { PopupFindMatriculaComponent } from './shared/popups/popup-find-matricula/popup-find-matricula.component';
import { PopupFindConceptoComponent } from './shared/popups/popup-find-concepto/popup-find-concepto.component';
import { PopupFindComprobanteComponent } from './shared/popups/popup-find-comprobante/popup-find-comprobante.component';
import { PopupEdiarRegistroDeudaComponent } from './shared/popups/popup-ediar-registro-deuda/popup-ediar-registro-deuda.component';
import { PopupRealizarFacturaComponent } from './shared/popups/popup-realizar-factura/popup-realizar-factura.component';
import { BuscarComprobanteAfipComponent } from './pages/factura/factura-electronica/popups/buscar-comprobante-afip/buscar-comprobante-afip.component';
import { BuscarConceptoFacturaComponent } from './pages/factura/factura-electronica/popups/buscar-concepto-factura/buscar-concepto-factura.component';
import { PopupFacturaRenglonComponent } from './pages/factura/factura-electronica/popups/popup-factura-renglon/popup-factura-renglon.component';
// tslint:disable-next-line: max-line-length
import { BuscarClienteFacturaComponent } from './pages/factura/factura-electronica/popups/buscar-cliente-factura/buscar-cliente-factura.component';
import { PopupFindPacienteComponent } from './shared/popups/popup-find-paciente/popup-find-paciente.component';
import { PopupEditarPacienteComponent } from './shared/popups/popup-editar-paciente/popup-editar-paciente.component';
import { PopupListaPacienteComponent } from './shared/popups/popup-lista-paciente/popup-lista-paciente.component';
import { MatriculaCajaComponent } from './pages/matricula/matricula-caja/matricula-caja.component';
import { MatriculaCobroComponent } from './pages/matricula/matricula-cobro/matricula-cobro.component';
import { PopupConceptoAgregarComponent } from './pages/matricula/matricula-cobro/popups/popup-concepto-agregar/popup-concepto-agregar.component';
import { OrdenIngresoComponent } from './pages/liquidacion/orden/orden-ingreso/orden-ingreso.component';
import { OrdenAuditarComponent } from './pages/liquidacion/orden/orden-auditar/orden-auditar.component';
import { OrdenAfectarComponent } from './pages/liquidacion/orden/orden-afectar/orden-afectar.component';
import { PopupOrdenEditarComponent } from './pages/liquidacion/orden/popups/popup-orden-editar/popup-orden-editar.component';
import { PopupConceptoMatriculaEditarComponent } from './pages/mantenimiento/concepto-matricula/popup-concepto-matricula-editar/popup-concepto-matricula-editar.component';
import { PopupFindObraSocialComponent } from './shared/popups/popup-find-obra-social/popup-find-obra-social.component';
import { PopupFindConvenioComponent } from './shared/popups/popup-find-convenio/popup-find-convenio.component';



/* -------------------------------------------------------------------------- */
/*                                 DIRECTIVAS                                 */
/* -------------------------------------------------------------------------- */


registerLocaleData(localeEsAR, 'es-Ar');

/* -------------------------------------------------------------------------- */
/*                                   PAGINAS                                  */
/* -------------------------------------------------------------------------- */

@NgModule({
  declarations: [
    AppComponent,
    DateFormatPipe,
    NavbarComponent,
    EmptyComponent,
    NotFoundComponent,
    CustomPreloaderComponent,
    PopupUsuarioComponent,
    MatriculaGeneralComponent,
    PopupMatriculaObraSocialComponent,
    PopupMatriculaEditarComponent,
    UsuarioComponent,
    UsuarioModuloComponent,
    UsuarioEditarComponent,
    ObraSocialComponent,
    PmoComponent,
    ConvenioComponent,
    PopupObraSocialEditarComponent,
    PopupPmoEditarComponent,
    PopupConvenioEditarComponent,
    PopupMovimientoComponent,
    PopupMovimientoConceptoCuentaEditarComponent,
    PopupMovimientoCuentaEditarComponent,
    PopupMovimientoTipoComprobanteEditarComponent,
    LoginComponent,
    ConceptoMatriculaComponent,
    MantenimientoComponent,
    ListadoCajaComponent,
    MovimientoCuentaComponent,
    MovimientoConceptoCuentaComponent,
    MovimientoTipoComprobanteComponent,
    MovimientoTipoMonedaComponent,
    PopupProveedorFindComponent,
    FacturaElectronicaComponent,
    OtrasAccionesComponent,
    LoadingComponent,
    PopupFindMatriculaComponent,
    PopupFindConceptoComponent,
    PopupFindComprobanteComponent,
    PopupEdiarRegistroDeudaComponent,
    PopupRealizarFacturaComponent,
    BuscarComprobanteAfipComponent,
    BuscarConceptoFacturaComponent,
    PopupFacturaRenglonComponent,
    BuscarClienteFacturaComponent,
    PopupFindPacienteComponent,
    PopupEditarPacienteComponent,
    PopupListaPacienteComponent,
    MatriculaCajaComponent,    
    MatriculaCobroComponent,
    PopupConceptoAgregarComponent,
    PopupConceptoMatriculaEditarComponent,
    OrdenIngresoComponent,
    OrdenAuditarComponent,
    OrdenAfectarComponent,
    MatriculaCobroComponent,
    PopupOrdenEditarComponent,
    PopupFindObraSocialComponent,
    PopupFindConvenioComponent
    
  ],
  imports: [


    BrowserModule,
    FormsModule,
    MultiSelectModule,
    ReactiveFormsModule,
    HttpClientModule ,
    BrowserAnimationsModule,
    TableModule,
    DropdownModule,
    DialogModule,
    RadioButtonModule,
    CalendarModule,
    InputMaskModule,
    MenubarModule,
    MenuModule,
    CheckboxModule,
    SpinnerModule,
    ToastModule,
    TabViewModule,
    ListboxModule,
    OverlayPanelModule,
    DynamicDialogModule,
    OrderListModule,
    InputTextareaModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    InputSwitchModule,
    PanelModule,
    ColorPickerModule,
    ToggleButtonModule,
    AutoCompleteModule,
    SweetAlert2Module.forRoot(),
    AutofocusModule,
    AppRoutingModule,


  ],
  entryComponents: [
    PopupMatriculaObraSocialComponent,
    PopupMatriculaEditarComponent,
    PopupUsuarioComponent,
    UsuarioModuloComponent,
    UsuarioEditarComponent,
    PopupObraSocialEditarComponent,
    PopupPmoEditarComponent,
    PopupConvenioEditarComponent,
    PopupMovimientoComponent,
    PopupMovimientoConceptoCuentaEditarComponent,
    PopupMovimientoCuentaEditarComponent,
    PopupMovimientoTipoComprobanteEditarComponent,
    PopupProveedorFindComponent,
    PopupFindMatriculaComponent,
    PopupFindConceptoComponent,
    PopupFindComprobanteComponent,
    PopupEdiarRegistroDeudaComponent,
    PopupRealizarFacturaComponent,
    BuscarComprobanteAfipComponent,
    BuscarConceptoFacturaComponent,
    PopupFacturaRenglonComponent,
    BuscarClienteFacturaComponent,
    PopupFindPacienteComponent,
    PopupEditarPacienteComponent,
    PopupListaPacienteComponent,
    PopupOrdenEditarComponent,
    PopupConceptoMatriculaEditarComponent,
    PopupFindObraSocialComponent,
    PopupFindConvenioComponent    

    
  ],
  providers: [CurrencyPipe, DecimalPipe,
    PushNotificationService, ExcelService, { provide: LOCALE_ID, useValue: 'es-Ar' },
 {
  provide: HTTP_INTERCEPTORS,
  useFactory: function(injector: Injector) {
      return new JwtInterceptor(injector);
  },
  multi: true,
  deps: [Injector]
},
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
