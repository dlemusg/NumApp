import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SystemEqPage } from '../pages/system-eq/system-eq';
import { InterpolationPage } from '../pages/interpolation/interpolation';
import { NonLinearPage } from '../pages/non-linear/non-linear';
import { BisectionPage } from './../pages/non-linear/bisection/bisection';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SystemEqPage,
    InterpolationPage,
    NonLinearPage,
    BisectionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SystemEqPage,
    InterpolationPage,
    NonLinearPage,
    BisectionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
