import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ClarityModule } from "@clr/angular";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService, CookieOptions } from 'angular2-cookie';
import { AuthenticationInterceptor } from './http-interceptors';
import { ChartsModule } from 'ng2-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminComponent } from './components/admin/admin.component';
import { HeaderComponent } from './components/header/header.component';
import { CompanyComponent } from './components/company/company.component';
import { FarmerComponent } from './components/farmer/farmer.component';
import { NurseryComponent } from './components/nursery/nursery.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    AdminComponent,
    HeaderComponent,
    CompanyComponent,
    FarmerComponent,
    NurseryComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    CookieService,
    { provide: CookieOptions, useValue: {} },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
