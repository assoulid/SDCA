import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import {FormsModule} from '@angular/forms';



import { Home }  from './home';

@NgModule({
    imports: [BrowserModule,HttpModule,FormsModule],
    declarations: [Home],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [Home]
})
export class AppModule { }