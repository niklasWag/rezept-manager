import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezeptFormComponent } from './rezept-form.component';

describe('RezeptFormComponent', () => {
  let component: RezeptFormComponent;
  let fixture: ComponentFixture<RezeptFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RezeptFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RezeptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
