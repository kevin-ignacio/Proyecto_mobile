import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { GeolocationPosition } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  mensajeDesdePreferences: string | null = '';
  latitude: number | undefined;
  longitude: number | undefined;
  horaDesdePreferences: string | null = '';
  usuarios: any[] = [];



  imageSrc: string = '';
  fotoTomada: boolean = false; // Variable para verificar si se ha tomado una foto
  
  usuarioSesion: any; // Para almacenar los datos del usuario que ha iniciado sesión
  constructor(private router: Router,private alertController: AlertController) { }

  ngOnInit() {
    this.getCurrentPosition();
    this.retrieveMessageFromPreferences();
    this.retrieveUsuariosFromPreferences();
    this.retrieveHoraFromPreferences();
    this.ionViewWillEnter(); // Agrega esta línea

    this.retrieveUsuarioSesion(); // Agrega esta línea

    this.retrieveUsuarioSesion(); // Agrega esta línea


  }

  async getCurrentPosition() {
    try {
      const coordinates: GeolocationPosition = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;


      // Llama a la función para guardar las coordenadas en las preferencias
      this.guardarLatitudLongitud();

    } catch (error) {
      console.error('Error al obtener la posición actual:', error);
    }
  }


  async guardarLatitudLongitud() {
    if (this.latitude !== undefined && this.longitude !== undefined) {
      try {
        // Guarda la latitud y longitud en las preferencias
        await Preferences.set({ key: 'latitud', value: this.latitude.toString() });
        await Preferences.set({ key: 'longitud', value: this.longitude.toString() });
      } catch (error) {
        console.error('Error al guardar latitud y longitud en las preferencias:', error);
      }
    }
  }


  async abrirCamara() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });


      if (image && image.webPath) {
        this.imageSrc = image.webPath;
        this.fotoTomada = true; // Marca la foto como tomada
      } else {
        console.log('No se capturó ninguna imagen o la imagen es nula.');
      }

    } catch (error) {
      console.error('Error al abrir la cámara:', error);
    }
  }

  async retrieveMessageFromPreferences() {
    try {
      const mensaje = await Preferences.get({ key: 'mensaje' });
      if (mensaje && mensaje.value) {
        this.mensajeDesdePreferences = this.agregarSaltosDeLinea(mensaje.value);
        console.log('ahora si ', mensaje);
      }
    } catch (error) {
      console.error('Error al recuperar el mensaje desde Preferences:', error);
    }
  }

  async retrieveUsuariosFromPreferences() {
    try {
      const usuariosJSON = await Preferences.get({ key: 'usuarios' });
      if (usuariosJSON && usuariosJSON.value) {
        this.usuarios = JSON.parse(usuariosJSON.value);
      }
    } catch (error) {
      console.error('Error al recuperar usuarios desde Preferences:', error);
    }
  }


  async ionViewWillEnter() {

  
  }




  async retrieveUsuarioSesion() {

    try {
      const usuarioJSON = await Preferences.get({ key: 'usuario' });
      if (usuarioJSON && usuarioJSON.value) {
        this.usuarioSesion = JSON.parse(usuarioJSON.value);
      }
    } catch (error) {
      console.error('Error al recuperar el usuario de la sesión desde Preferences:', error);
    }
  }


  






  async retrieveHoraFromPreferences() {
    try {
      const hora = await Preferences.get({ key: 'hora' });
      if (hora && hora.value) {
        this.horaDesdePreferences = hora.value;
      }
    } catch (error) {
      console.error('Error al recuperar la hora desde Preferences:', error);
    }
  }


  async registrarClase() {
    if (this.fotoTomada) {
      
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'La clase ha sido registrada correctamente.',
        buttons: ['Aceptar']
      });

      await alert.present();
    } else {
      // Muestra una alerta si no se ha tomado una foto
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debes tomar una foto antes de registrar la clase.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }
  



  agregarSaltosDeLinea(mensaje: string) {
    return mensaje.replace(/,/g, '<br>');
  }

  async cerrarSesion() {
    // Elimina los datos relacionados con la sesión actual del LocalStorage
    await Preferences.remove({ key: 'nombreUsuario' });
    await Preferences.remove({ key: 'usuario' });

    // Elimina los datos relacionados con mensaje y hora
    await Preferences.remove({ key: 'mensaje' });
    await Preferences.remove({ key: 'hora' });
    await Preferences.remove({ key: 'claseActual' });

    await Preferences.remove({ key: 'latitud' });
    await Preferences.remove({ key: 'longitud' });

    



  

    console.log('Sesión cerrada');
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

}