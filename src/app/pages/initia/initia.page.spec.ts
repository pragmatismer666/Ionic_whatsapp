import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InitiaPage } from './initia.page';

describe('InitiaPage', () => {
  let component: InitiaPage;
  let fixture: ComponentFixture<InitiaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InitiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
