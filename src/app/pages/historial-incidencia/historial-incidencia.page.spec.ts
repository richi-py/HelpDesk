import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialIncidenciaPage } from './historial-incidencia.page';

describe('HistorialIncidenciaPage', () => {
  let component: HistorialIncidenciaPage;
  let fixture: ComponentFixture<HistorialIncidenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialIncidenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
