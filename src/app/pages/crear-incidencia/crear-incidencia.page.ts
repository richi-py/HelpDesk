import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonTextarea,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cameraOutline,
  closeCircleOutline,
  laptopOutline,
  settingsOutline,
  wifiOutline,
} from 'ionicons/icons';
import { IncidenciasService } from '../../services/incidencias.service';
import type { TipoIncidencia, UrgenciaIncidencia } from '../../models/incidencia.model';

@Component({
  selector: 'app-crear-incidencia',
  templateUrl: './crear-incidencia.page.html',
  styleUrls: ['./crear-incidencia.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
  ],
})
export class CrearIncidenciaPage implements OnInit, OnDestroy {
  asunto = '';
  descripcion = '';
  tipoSeleccionado = 'Equipo';
  urgencia = 'Media';

  foto: File | null = null;
  fotoUrl: string | null = null;
  nombreFoto = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private incidenciasService: IncidenciasService
  ) {
    addIcons({
      arrowBackOutline,
      cameraOutline,
      closeCircleOutline,
      laptopOutline,
      settingsOutline,
      wifiOutline,
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.fotoUrl) {
      URL.revokeObjectURL(this.fotoUrl);
    }
  }

  Volver() {
    this.router.navigate(['/tabs/tab1']);
  }

  SeleccionarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
  }

  SeleccionarUrgencia(nivel: string) {
    this.urgencia = nivel;
  }

  async SeleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/') && !archivo.name.match(/\.(jpg|jpeg|png|heic|heif|webp)$/i)) {
        return;
      }
      const archivoFinal = await this.convertirAJpeg(archivo);
      this.foto = archivoFinal;
      this.nombreFoto = archivoFinal.name;
      if (this.fotoUrl) {
        URL.revokeObjectURL(this.fotoUrl);
      }
      this.fotoUrl = URL.createObjectURL(archivoFinal);
    }
  }

  private convertirAJpeg(archivo: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const nombreBase = archivo.name.replace(/\.[^/.]+$/, '');
                  const nuevoArchivo = new File([blob], `${nombreBase}.jpg`, {
                    type: 'image/jpeg',
                  });
                  resolve(nuevoArchivo);
                  return;
                }
                resolve(archivo);
              },
              'image/jpeg',
              0.85
            );
          } else {
            resolve(archivo);
          }
        };
        img.onerror = () => resolve(archivo);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(archivo);
      reader.readAsDataURL(archivo);
    });
  }

  EliminarFoto() {
    if (this.fotoUrl) {
      URL.revokeObjectURL(this.fotoUrl);
    }
    this.foto = null;
    this.fotoUrl = null;
    this.nombreFoto = '';
  }

  private mapearTipo(tipo: string): TipoIncidencia {
    const t = tipo.toLowerCase();
    if (t === 'equipo') return 'hardware';
    if (t === 'red') return 'red';
    if (t === 'software') return 'software';
    return 'otro';
  }

  private mapearUrgencia(urg: string): UrgenciaIncidencia {
    const u = urg.toLowerCase();
    if (u === 'alta') return 'alta';
    if (u === 'baja') return 'baja';
    return 'media';
  }

  async CrearIncidencia() {
    if (this.asunto.trim() === '' || this.descripcion.trim() === '') {
      const alerta = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Por favor completa el asunto y la descripción.',
        buttons: ['Aceptar'],
      });
      await alerta.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando incidencia...',
    });
    await loading.present();

    const payload = {
      titulo: this.asunto.trim(),
      descripcion: this.descripcion.trim(),
      tipo: this.mapearTipo(this.tipoSeleccionado),
      urgencia: this.mapearUrgencia(this.urgencia),
    };

    this.incidenciasService.crearIncidencia(payload).subscribe({
      next: (nuevaIncidencia) => {
        if (this.foto && nuevaIncidencia?.id) {
          loading.message = 'Subiendo fotografía adjunta...';
          this.incidenciasService.subirImagen(nuevaIncidencia.id, this.foto, 'reporte').subscribe({
            next: async () => {
              await loading.dismiss();
              this.mostrarExito(nuevaIncidencia.codigo);
            },
            error: async (err) => {
              await loading.dismiss();
              console.error('Error al subir imagen:', err);
              const alerta = await this.alertController.create({
                header: 'Incidencia creada con advertencia',
                message: `La incidencia #${nuevaIncidencia.codigo} se registró, pero hubo un problema al subir la foto adjunta.`,
                buttons: [{ text: 'Aceptar', handler: () => this.Volver() }],
              });
              await alerta.present();
            },
          });
        } else {
          loading.dismiss();
          this.mostrarExito(nuevaIncidencia?.codigo);
        }
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error al crear incidencia:', err);
        const alerta = await this.alertController.create({
          header: 'Error al registrar',
          message:
            err?.error?.error ||
            'No se pudo registrar la incidencia. Asegúrate de haber iniciado sesión y que el servidor de Flask esté activo.',
          buttons: ['Aceptar'],
        });
        await alerta.present();
      },
    });
  }

  private async mostrarExito(codigo?: string) {
    const alerta = await this.alertController.create({
      header: '¡Incidencia creada!',
      message: codigo
        ? `Tu incidencia #${codigo} se registró correctamente con su fotografía.`
        : 'Tu incidencia se registró correctamente.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.Volver();
          },
        },
      ],
    });
    await alerta.present();
  }
}
