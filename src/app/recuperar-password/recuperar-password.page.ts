import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage {
  usuarios: any[] = [];
  rutInput: string = '';
  nombreUsuarioInput: string = '';
  resultadoContrasena: string = '';

  nuevaContrasena: string = ''; // Declarar nuevaContrasena
  nombreUsuarioActual: string = '';
  contrasenaActual: string = '';
  constructor(private alertController: AlertController) {}

  async ngOnInit() {
    // Obtener la lista de usuarios desde las preferencias
    const usuariosPreferences = await Preferences.get({ key: 'usuarios' });
    if (usuariosPreferences && usuariosPreferences.value) {
      this.usuarios = JSON.parse(usuariosPreferences.value);
    }
  }

  async buscarContrasena() {
    if (this.nombreUsuarioInput.trim() === '' || this.rutInput.trim() === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      const usuarioEncontrado = this.usuarios.find(nombreLogin => nombreLogin.nombreLogin === this.nombreUsuarioInput && nombreLogin.rut === this.rutInput);

      if (usuarioEncontrado) {
        this.resultadoContrasena = usuarioEncontrado.password;

        // Muestra una alerta con la contraseña
        const alert = await this.alertController.create({
          header: 'Contraseña Encontrada',
          message: 'La contraseña es: ' + this.resultadoContrasena,
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Nombre de usuario o RUT no encontrado',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    }
  }

  async cambiarContrasena() {
    // Obtén el objeto de usuarios desde las preferencias
    const usuariosPreferences = await Preferences.get({ key: 'usuarios' });

    if (usuariosPreferences && usuariosPreferences.value) {
      const usuarios = JSON.parse(usuariosPreferences.value);

      // Busca el usuario actual
      const usuarioActual = usuarios.find(
        (nombreLogin: { nombreLogin: string; password: string }) =>
          nombreLogin.nombreLogin === this.nombreUsuarioActual && nombreLogin.password === this.contrasenaActual
      );

      if (usuarioActual) {
        // La contraseña actual coincide, puedes proceder a cambiarla
        usuarioActual.password = this.nuevaContrasena;

        // Actualiza el objeto de usuarios en las preferencias
        await Preferences.set({
          key: 'usuarios',
          value: JSON.stringify(usuarios),
        });

        const successAlert = await this.alertController.create({
          header: 'Contraseña Cambiada',
          message: 'La contraseña se ha cambiado con éxito.',
          buttons: ['Aceptar'],
        });
        await successAlert.present();
      } else {
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'Nombre de usuario o contraseña incorrectos.',
          buttons: ['Aceptar'],
        });
        await errorAlert.present();
      }
    } else {
      //nose
    }
  }
}