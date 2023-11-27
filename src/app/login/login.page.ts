import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder,
    public alertController: AlertController, private router: Router, public storage : StorageService) { 
    this.formularioLogin = this.fb.group({
      'nombreLogin': new FormControl("", Validators.required), // Cambio de 'nombre' a 'nombreLogin'
      'password': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }

  async ingresar() {
    if (this.formularioLogin.valid) {
      const f = this.formularioLogin.value;

  
      // Obtén la lista de usuarios registrados desde Preferences
      const usuariosJSON = await Preferences.get({ key: 'usuarios' });
      const usuarios: { nombreLogin: string, password: string }[] = usuariosJSON && usuariosJSON.value ? JSON.parse(usuariosJSON.value) : [];
  
      // Busca al usuario por su nombre de usuario (campo 'usuario')
      const user = usuarios.find((u: any) => u.nombreLogin === f.nombreLogin && u.password === f.password);
  
      if (user) {
        // Guarda los datos del usuario que ha iniciado sesión
        await Preferences.set({ key: 'nombreUsuario', value: user.nombreLogin });
        await Preferences.set({ key: 'usuario', value: JSON.stringify(user)});
  
        console.log("Sesión iniciada");
        this.router.navigate(['/home']);
        this.formularioLogin.reset();

      } else {
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos que se ingresaron no son correctos.',
          buttons: ['Aceptar']
        });
  
        await alert.present();
      }
    }else{
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
    }
  }
