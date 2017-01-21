import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';
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
@Component({
    styleUrls: ["app/css/index.scss"]
})

export class AppModule { }