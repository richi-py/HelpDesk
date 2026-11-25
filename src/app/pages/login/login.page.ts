import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonInputPasswordToggle,
  IonImg,
  IonButton,
  IonIcon,
  IonModal,
  IonButtons,
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  personOutline,
  mailOutline,
  businessOutline,
  callOutline,
  closeOutline,
  personAddOutline,
  logInOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { IncidenciasService } from '../../services/incidencias.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonInput,
    IonInputPasswordToggle,
    IonImg,
    IonButton,
    IonIcon,
    IonModal,
    IonButtons,
  ],
})
export class LoginPage implements OnInit {
  modalRegistroAbierto = false;
  cargando = false;

  loginForm = new FormGroup({
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  registroForm = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    area: new FormControl('General', { nonNullable: true }),
    telefono: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private incidenciasService: IncidenciasService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({
      lockClosedOutline,
      personOutline,
      mailOutline,
      businessOutline,
      callOutline,
      closeOutline,
      personAddOutline,
      logInOutline,
      alertCircleOutline,
    });
  }

  ngOnInit() {
    if (this.incidenciasService.isAuthenticated()) {
      this.navCtrl.navigateRoot('/tabs/tab1');
    }
  }

  get correoControl(): FormControl<string> {
    return this.loginForm.controls.correo;
  }

  get passwordControl(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  get registroNombre(): FormControl<string> {
    return this.registroForm.controls.nombre;
  }

  get registroCorreo(): FormControl<string> {
    return this.registroForm.controls.correo;
  }

  get registroPassword(): FormControl<string> {
    return this.registroForm.controls.password;
  }

  abrirRegistro(abrir: boolean) {
    this.modalRegistroAbierto = abrir;
  }

  async submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      const alerta = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Por favor corrige los campos marcados en rojo antes de continuar.',
        buttons: ['Entendido'],
      });
      await alerta.present();
      return;
    }

    const { correo, password } = this.loginForm.getRawValue();
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    this.cargando = true;
    this.incidenciasService.login(correo.trim().toLowerCase(), password).subscribe({
      next: async () => {
        this.cargando = false;
        await loading.dismiss();
        this.navCtrl.navigateRoot('/tabs/tab1');
      },
      error: async (err) => {
        this.cargando = false;
        await loading.dismiss();
        let mensaje =
          'No se pudo conectar con el servidor (http://localhost:5000). Asegúrate de que el backend Flask esté corriendo.';
        if (err.status === 401) {
          mensaje =
            'Correo o contraseña incorrectos. Si aún no tienes cuenta, haz clic en "Crear cuenta".';
        } else if (err?.error?.error) {
          mensaje = err.error.error;
        }

        const alerta = await this.alertController.create({
          header: 'Error al ingresar',
          message: mensaje,
          buttons: ['Aceptar'],
        });
        await alerta.present();
      },
    });
  }

  async submitRegistro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      const alerta = await this.alertController.create({
        header: 'Formulario inválido',
        message: 'Por favor completa todos los campos requeridos correctamente.',
        buttons: ['Entendido'],
      });
      await alerta.present();
      return;
    }

    const { nombre, correo, password, area, telefono } = this.registroForm.getRawValue();
    const loading = await this.loadingController.create({
      message: 'Registrando usuario en HelpDesk...',
      spinner: 'crescent',
    });
    await loading.present();

    this.incidenciasService
      .register({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        password,
        rol: 'usuario',
        area: area || 'General',
        telefono: telefono || '',
      })
      .subscribe({
        next: async (res) => {
          await loading.dismiss();
          this.modalRegistroAbierto = false;
          const alerta = await this.alertController.create({
            header: '¡Registro Exitoso!',
            message: `Bienvenido(a) ${res.usuario?.nombre || ''}. Tu cuenta ha sido creada exitosamente en HelpDesk.`,
            buttons: [
              {
                text: 'Comenzar',
                handler: () => {
                  this.navCtrl.navigateRoot('/tabs/tab1');
                },
              },
            ],
          });
          await alerta.present();
        },
        error: async (err) => {
          await loading.dismiss();
          let mensaje = 'Error al registrar usuario en la base de datos.';
          if (err.status === 409) {
            mensaje = 'El correo electrónico ya se encuentra registrado. Intenta iniciar sesión.';
          } else if (err?.error?.error) {
            mensaje = err.error.error;
          }
          const alerta = await this.alertController.create({
            header: 'Error en el registro',
            message: mensaje,
            buttons: ['Aceptar'],
          });
          await alerta.present();
        },
      });
  }
}
