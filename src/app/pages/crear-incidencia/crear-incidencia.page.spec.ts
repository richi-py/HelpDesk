import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearIncidenciaPage } from './crear-incidencia.page';

describe('CrearIncidenciaPage', () => {
  let component: CrearIncidenciaPage;
  let fixture: ComponentFixture<CrearIncidenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearIncidenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
