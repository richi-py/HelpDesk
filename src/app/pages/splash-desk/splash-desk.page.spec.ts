import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashDeskPage } from './splash-desk.page';

describe('SplashDeskPage', () => {
  let component: SplashDeskPage;
  let fixture: ComponentFixture<SplashDeskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashDeskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
