import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Dataservice} from '../../providers/dataservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/*
  Generated class for the Addtodo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-addtodo',
  templateUrl: 'addtodo.html',
      providers: [Dataservice]
})
export class AddtodoPage {

todoForm: FormGroup;
  constructor(private navController: NavController, private fb: FormBuilder, private todoService: Dataservice) {
        this.todoForm = fb.group({
          'name': ['', Validators.compose([Validators.required,Validators.pattern('[a-zA-Z, ]*'),Validators.minLength(3),Validators.maxLength(100)])],
          'description':['']
        });
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddtodoPage');
  }

  addToDo() {
	let date = new Date();
	let newDoc = {
		'name': this.todoForm.value.name,
		'description':this.todoForm.value.description,
		'createdTime': date.getTime()
	};
	//Add the to do using the data service
	this.todoService.addToDo(newDoc);
	//After the addition navigate to the list view
	this.navController.popToRoot();
}


}
