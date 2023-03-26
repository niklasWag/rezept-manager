import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezeptCardComponent } from './rezept-card.component';

describe('RezeptCardComponent', () => {
  let component: RezeptCardComponent;
  let fixture: ComponentFixture<RezeptCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RezeptCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RezeptCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
