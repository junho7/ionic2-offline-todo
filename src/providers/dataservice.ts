import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the Dataservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Dataservice {

 private db: any ;
//cloudant username
private userName = 'josephinejustin';
//cloudant password
private password= 'mobile123' ;
//cloudant db url
private dbURL = 'https://josephinejustin.cloudant.com/tododb';
//array of todos
private toDos = [];

constructor() {
  this.db = new PouchDB('tododb');
    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.userName,
      	 password: this.password
      }
    }
    //Sync the db with Cloudant
    this.db.sync(this.dbURL, options);
}


addToDo(doc) {
	return this.db.post(doc);
}

deleteToDo(doc) {
	return this.db.remove(doc);
}

retrieveToDos(){
	return new Promise<any>(resolve => {

		this.db.allDocs({include_docs: true}).then((result) => {
			if (result.total_rows > 0)
			{
				result.rows.map((row) => {
					this.toDos.push(row.doc);
					resolve(this.toDos);
				});
			}
			else {
				resolve(this.toDos);
			}
			this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
				this.onChange(change);
			});
		}).catch((error) => {
			console.log(error);
		});
	});
}

onChange(change){
	let changedDoc = null;
	let changedIndex = null;
	this.toDos.forEach((doc, index) => {
		if(doc._id === change.id){
			changedDoc = doc;
			changedIndex = index;
		}
	});

	//Handle deleted document
	if(change.deleted){
		this.toDos.splice(changedIndex, 1);
	}
	else {
		//Handle the updates
		if(changedDoc){
			this.toDos[changedIndex] = change.doc;
		}
		//Handle additions
		else {
			this.toDos.push(change.doc);
		}
	}
}


}
