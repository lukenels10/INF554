import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProportionalSymbolMapComponent } from './proportional-symbol-map/proportional-symbol-map.component';
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component';
import { LosAngelesCountyMapComponent } from './los-angeles-county-map/los-angeles-county-map.component';

@NgModule({
  declarations: [
    AppComponent,
    ProportionalSymbolMapComponent,
    ChoroplethMapComponent,
    LosAngelesCountyMapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
