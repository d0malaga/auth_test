import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Member } from './member';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const members = [{'id':0,'name':'John Smith','email':'john.smith@mailinator.com','phoneNumber':'2125551212'},{'id':1,'name':'Tomas','email':'q@q','phoneNumber':'1234567890'}];
    // [
    //   { id: 11, name: 'Dr Nice' },
    //   { id: 12, name: 'Narco' },
    //   { id: 13, name: 'Bombasto' },
    //   { id: 14, name: 'Celeritas' },
    //  { id: 20, name: 'Tornado' }
    // ];
    return {members};
  }

  // Overrides the genId method to ensure that a member always has an id.
  // If the members array is empty,
  // the method below returns the initial number (11).
  // if the members array is not empty, the method below returns the highest
  // member id + 1.
  genId(members: Member[]): number {
    return members.length > 0 ? Math.max(...members.map(member => member.id)) + 1 : 11;
  }
}
