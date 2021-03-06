import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ArticleService } from './article.service';
import { CategoryService } from './category.service';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { ArticleComponent } from './article/article.component';
import { CreateComponent } from './create/create.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { EditComponent } from './edit/edit.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ErrorComponent } from './error/error.component';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ArticleComponent,
    CreateComponent,
    LoadingSpinnerComponent,
    EditComponent,
    RegisterComponent,
    LoginComponent,
    UserInfoComponent,
    ErrorComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    DeviceDetectorModule.forRoot()

    ],
  providers: [ArticleService, CategoryService, AuthService, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
