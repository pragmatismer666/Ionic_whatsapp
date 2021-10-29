import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CallingPage } from './calling.page';

describe('CallingPage', () => {
  let component: CallingPage;
  let fixture: ComponentFixture<CallingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CallingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
