import { GraficadorPage } from './../../graficador/graficador';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController }
  from 'ionic-angular';
import { HttpNonLinearProvider }
  from './../../../providers/http-non-linear/http-non-linear';


@IonicPage()
@Component({
  selector: 'page-bisection',
  templateUrl: 'bisection.html',
})
export class BisectionPage {
  private rows = [];
  private table;
  private apiUrl;
  private dataSubmit = {};
  private dataReceived = {};
  private graf = false;

  // build the page by assigning values to the global variables.
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public HttpNonLinearProvider:
      HttpNonLinearProvider) {
    this.dataSubmit['f'] = '';
    this.dataSubmit['xi'] = '';
    this.dataSubmit['xs'] = '';
    this.dataSubmit['tolerancia'] = '';
    this.dataSubmit['niteraciones'] = '';
    this.dataSubmit['tipoError'] = '';
    

    this.table = true;
    this.initializationDataRecived();
    this.apiUrl = 'https://tranquil-plateau-12350.herokuapp.com/bisection';
  }

  // When the page loads, a signal is sent to the console.
  ionViewDidLoad() {
    console.log('ionViewDidLoad BisectionPage');
  }

  /* check if the fields are empty and show a signal, if they are empty, call 
  the postServer function */
  submitForm() {
    this.graf = false;
    console.log("2");
    if (this.dataSubmit['f'] == '') {
      this.showAlert("ERROR:", "The field f(x) can not be empty");
    } else if (this.dataSubmit['xi'] == '') {
      this.showAlert("ERROR:", "The field xi can not be empty");
    } else if (this.dataSubmit['xs'] == '') {
      this.showAlert("ERROR:", "The field xs can not be empty.");
    } else if (this.dataSubmit['tolerancia'] == '') {
      this.showAlert("ERROR:", "The tolerance field can not be empty");
    } else if (this.dataSubmit['niteraciones'] == '') {
      this.showAlert("ERROR:", "The field No. Iters can not be empty");
    } else if (this.dataSubmit['tipoError'] == '') {
      this.showAlert("ERROR:", "The Error Type field can not be empty");
    } else {
      console.log("3");
      this.postServer();
    }
  }

  //Initialize the variables
  initializationDataRecived(){
    this.rows = [];
    this.rows = [...this.rows];
    this.dataReceived['n'] = [];
    this.dataReceived['xi'] = [];
    this.dataReceived['xs'] = [];
    this.dataReceived['xm'] = [];
    this.dataReceived['f'] = [];
    this.dataReceived['error'] = [];
    this.dataReceived['raices'] = [];
  }

  // add the graphing page below the buttons and hide the table.
  graficador() {
    this.graf = true;
    var points = []
    var final = []

    for(var i = 0; i < this.dataReceived['xm'].length;i++){

      if(i == this.dataReceived['xm'].length - 1){
        final.push({
          "x": this.dataReceived['xm'][i],
          "y": this.dataReceived['fxm'][i]
        });
      }
      points.push({
        "x": this.dataReceived['xm'][i],
        "y": this.dataReceived['fxm'][i]
      }); 
    }

    var send = {
      'f': this.dataSubmit['f'],
      'a': this.dataSubmit['xi'],
      'b': this.dataSubmit['xs'],
      'points': points,
      'raices': final
    }
    this.navCtrl.push(GraficadorPage, send);
  }

  graph(){
    this.submitForm();
    this.graf = true;
  }

  // add the graphing page below the buttons and hide the table.
  help() {
    let alert = this.alertCtrl.create({
      title: 'Help!',
      message: ` <ul>
                    <li> f (x) must be a continuous function </ li>
                    <br> <br>
                    <li> To find an adequate interval [a, b] help yourself with
                     incremental searches </ li>
                    <br> <br>
                    <li> There is a single root if it is true that f is 
                    continuous in [a, b], f (a) * f (b) <0, f is differentiable 
                    in (a, b) and f '(x) does not change sign for all x that 
                    belongs [a, b] </ li>
                    <br> <br>
                    <li> The elevation for the absolute error in each stage is
                    En = (In - 1) / 2 </ li>
                    <br> <br>
                  </ ul> `,
      buttons: ['OK']
    });
    alert.present();
  }

  // shows an alert on the screen
  showAlert(error, subtitle) {
    let alert = this.alertCtrl.create({
      title: error,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  // complete the table with the values sent by the server
  tableComplete() {
    this.table = false;//people can see the table
    var i;
    for (i = 0; i < this.dataReceived['n'].length; i++) {
      var json = {
        "n": this.dataReceived['n'][i],
        "xi": this.dataReceived['xi'][i],
        "xs": this.dataReceived['xs'][i],
        "xm": this.dataReceived['xm'][i],
        "fx": this.dataReceived['fxm'][i],
        "error": this.dataReceived['error'][i],
      };
      this.rows.push(json);
      this.rows = [...this.rows];
    }
  }
  
  /* communicates with the server sending the data, when it finishes it calls 
  the function tableComplete() */
  postServer() {
    this.HttpNonLinearProvider.post(this.dataSubmit, this.apiUrl)
      .then(result => {
        this.initializationDataRecived();
        if (typeof (result) == "string") {
          this.showAlert("ERROR", result)
        }
        else {
          this.dataReceived = result;
          console.log(result);
          if(this.graf) this.graficador();
          if(this.dataReceived['n'].length == 0 && this.dataReceived['raices'].length  == 1)
            this.showAlert("root: ",this.dataReceived["raices"][0]);
          else{ 
            this.showAlert("Approximate root: ",this.dataReceived["raices"][0]);
            this.tableComplete();
          }
        }
      }, (err) => {
        console.log(err);
      });
  }

}