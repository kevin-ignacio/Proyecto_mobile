import { Component, AfterViewInit, ViewChild, VERSION } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result, BarcodeFormat } from '@zxing/library';
import { Router } from '@angular/router'; // Importa el servicio de enrutamiento
import { StorageService } from '../services/storage.service';
import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterViewInit {
  nombreUsuario: string = '';
  ngVersion = VERSION.full;

  private scanned = false;/* escanner para una  vez*/

  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;

  hasDevices = false;
  hasPermission = false;
  qrResultString = '';
  qrResult: Result | null = null;
  availableDevices: MediaDeviceInfo[] = [];

  // Configura las cámaras aquí
  currentDevice: MediaDeviceInfo | null = null;
  devices: MediaDeviceInfo[] = [];

  formats: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];

  constructor(private router: Router, private storageService : StorageService) {} // Inyecta el servicio de enrutamiento

  async ngOnInit() {
    const usuariosJSON = await Preferences.get({ key: 'usuarios' });
    const usuarios = usuariosJSON && usuariosJSON.value ? JSON.parse(usuariosJSON.value) : [];

    if (usuarios.length > 0) {
      const ultimoUsuario = usuarios[usuarios.length - 1]; // ahora muestra el último usuario
      this.nombreUsuario = ultimoUsuario.nombreLogin;
    }
  }

  ngAfterViewInit(): void {
    if (this.scanner) {
      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.hasDevices = true;
        this.devices = devices;

        // Selecciona la cámara virtual "Iriun Webcam" si está disponible
        for (const device of devices) {
          if (device.label.includes('Iriun Webcam')) {
            this.currentDevice = device;
            break;
          }
        }
      });

      this.scanner.camerasNotFound.subscribe(() => (this.hasDevices = false));
      this.scanner.scanComplete.subscribe((result: Result) => {
        this.qrResult = result;
        this.handleQrCodeResult(result?.getText());
      });

      this.scanner.permissionResponse.subscribe(
        (perm: boolean) => (this.hasPermission = perm)
      );
    }
  }

  selectDevice(device: MediaDeviceInfo) {
    this.currentDevice = device;
  }

  handleQrCodeResult(resultString: string | null) {
    if (!this.scanned && resultString) {
      this.scanned = true; // Establece en true para evitar escanear nuevamente

      const now = new Date();
      const horaActual = now.toLocaleTimeString();
      Preferences.set({ key: 'hora', value: horaActual });
      this.qrResultString = resultString;
      const fechaActual = now.toLocaleDateString();
      const locura = `${resultString}, Fecha: ${fechaActual}`;
      const mensajeOriginal = `${JSON.stringify(locura)}`;
      Preferences.set({ key: 'mensaje', value: mensajeOriginal });
      console.log(mensajeOriginal);
      this.router.navigate(['/info']);
    }
  }
}












