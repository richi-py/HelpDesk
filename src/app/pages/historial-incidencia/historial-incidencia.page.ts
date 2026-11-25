import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { notifications, checkmark } from 'ionicons/icons';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonIcon,
} from '@ionic/angular';
import { IncidenciasService } from '../../services/incidencias.service';

@Component({
  selector: 'app-historial-incidencia',
  templateUrl: './historial-incidencia.page.html',
  styleUrls: ['./historial-incidencia.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButtons,
    IonIcon,
  ],
})
export class HistorialIncidenciaPage implements OnInit {
  incidencia: any;
  historial: any[] = [];
  solucion: string = '';

  constructor(
    private router: Router,
    private incidenciasService: IncidenciasService
  ) {
    addIcons({ notifications, checkmark });

    this.incidencia =
      this.router.getCurrentNavigation()?.extras.state?.['incidencia'] ||
      history.state?.incidencia;
  }

  ngOnInit() {
    if (!this.incidencia) {
      this.router.navigate(['/tabs/tab1']);
      return;
    }

    const usuario = this.incidenciasService.getUsuarioActual();
    const nombreUsuario = usuario?.nombre || 'Usuario';
    const nombreTecnico = this.incidencia.tecnico_nombre || 'Técnico de soporte';

    // Si la incidencia trae su historial real desde MongoDB Atlas:
    if (this.incidencia.historial && this.incidencia.historial.length > 0) {
      this.historial = this.incidencia.historial.map((h: any, idx: number, arr: any[]) => {
        const esUltimoYResuelto =
          idx === arr.length - 1 &&
          (h.estado === 'resuelta' || this.incidencia.status === 'Resuelto');

        let titulo = h.estado || 'Actualización';
        if (titulo === 'creada') titulo = 'Creada';
        else if (titulo === 'en_proceso') titulo = 'En proceso';
        else if (titulo === 'resuelta') titulo = 'Resuelta';
        else if (titulo === 'asignada') titulo = 'Asignada';

        return {
          titulo,
          tiempo: this.formatearFecha(h.fecha) || this.incidencia.time,
          autor: `${h.por_nombre || 'Personal'} (${h.por_rol || 'Soporte'})`,
          isCheck: esUltimoYResuelto,
        };
      });
    } else {
      // Construir historial dinámico según estado
      const estado = String(this.incidencia.status || '')
        .toLowerCase()
        .trim();

      this.historial = [
        {
          titulo: 'Creada',
          tiempo: this.incidencia.time || 'Fecha de reporte',
          autor: `${nombreUsuario} (Usuario)`,
          isCheck: false,
        },
      ];

      if (
        estado.includes('asignada') ||
        estado.includes('proceso') ||
        estado.includes('resuelt')
      ) {
        this.historial.push({
          titulo: 'Asignada a soporte',
          tiempo: 'Atención técnica',
          autor: `${nombreTecnico} (Técnico)`,
          isCheck: false,
        });
      }

      if (estado.includes('proceso') || estado.includes('resuelt')) {
        this.historial.push({
          titulo: 'En proceso',
          tiempo: 'En revisión técnica',
          autor: `${nombreTecnico} (Técnico)`,
          isCheck: false,
        });
      }

      if (estado.includes('resuelt')) {
        this.historial.push({
          titulo: 'Resuelta',
          tiempo: 'Completada',
          autor: `${nombreTecnico} (Técnico)`,
          isCheck: true,
        });
      }
    }

    if (this.incidencia.solucion) {
      this.solucion = this.incidencia.solucion;
    } else if (
      this.incidencia.comments &&
      this.incidencia.comments !== 'Aún no hay comentarios.'
    ) {
      this.solucion = this.incidencia.comments;
    } else {
      this.solucion = '';
    }
  }

  private formatearFecha(fechaIso?: string): string {
    if (!fechaIso) return '';
    try {
      const fecha = new Date(fechaIso);
      return fecha.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }
}
