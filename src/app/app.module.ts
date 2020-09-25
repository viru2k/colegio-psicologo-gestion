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
import { PopupMatriculaObraSocialComponent } from './pages/matricula/popups/popup-matricula-obra-social/popup-matricula-obra-social.component';
import { PopupMatriculaEditarComponent } from './pages/matricula/popups/popup-matricula-editar/popup-matricula-editar.component';
import { UsuarioComponent } from './pages/mantenimiento/usuario/usuario.component';
import { UsuarioModuloComponent } from './pages/mantenimiento/usuario-modulo/usuario-modulo.component';
import { CustomPreloaderComponent } from './shared/components/custom-preloader/custom-preloader.component';
import { UsuarioEditarComponent } from './pages/mantenimiento/usuario-editar/usuario-editar.component';
import { ObraSocialComponent } from './pages/mantenimiento/obra-social/obra-social.component';
import { PmoComponent } from './pages/mantenimiento/pmo/pmo.component';
import { ConvenioComponent } from './pages/mantenimiento/convenio/convenio.component';
import { PopupObraSocialEditarComponent } from './pages/mantenimiento/obra-social/popup-obra-social-editar/popup-obra-social-editar.component';
import { PopupPmoEditarComponent } from './pages/mantenimiento/obra-social/popup-pmo-editar/popup-pmo-editar.component';
import { PopupConvenioEditarComponent } from './pages/mantenimiento/obra-social/popup-convenio-editar/popup-convenio-editar.component';
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
    PopupConvenioEditarComponent
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
  entryComponents:[
    PopupMatriculaObraSocialComponent,
    PopupMatriculaEditarComponent,
    PopupUsuarioComponent,
    UsuarioModuloComponent,
    UsuarioEditarComponent,
    PopupObraSocialEditarComponent,
    PopupPmoEditarComponent,
    PopupConvenioEditarComponent
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
