import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Auth, GoogleAuthProvider,signInWithPopup } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  
  constructor(private fireAuth:AngularFireAuth, private auth: Auth) {
  }

  googleSignIn(){
    return signInWithPopup(this.auth,new GoogleAuthProvider);
  }
}
