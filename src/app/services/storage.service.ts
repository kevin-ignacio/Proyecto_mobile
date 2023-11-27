import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const storageUsuario = "usuarioActual";


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public userCorreo = "";
  constructor() { }


  async getItem(llave:string):Promise<string | null>{
    const obj = await Preferences.get({key:llave});
    return obj.value;
  }

  // metodo para obtener usuarios
  async obtenerUsuarios(llave:string):Promise<string | null>{
    return await localStorage.getItem(llave);
  }

  async setItem(llave:string, valor:string){
    await Preferences.set({key:llave,value:valor});
  }


  async obtenerUsuario(){
    const storageData = await this.getItem(storageUsuario);
    if (storageData == null) {
      return [];
    }

    const data:any[] = JSON.parse(storageData);
    if (data) {
      return data;
    }else{
      return [];
    }
  }

  async agregarUsuario(user:any[]){
    const usuarios = await this.obtenerUsuario();
    this.setItem(storageUsuario, JSON.stringify(user));
  }
  
  async getClase(llave: string): Promise<string> {
    const obj = await Preferences.get({ key: llave });
    if (obj.value == null) {
      return "";
    } else {
      return obj.value;
    }
  }

  async setClase(llave:string, valor:string){
    await Preferences.set({key:llave,value:valor});
  }


}