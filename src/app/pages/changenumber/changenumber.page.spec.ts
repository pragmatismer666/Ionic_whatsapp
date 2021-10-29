import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangenumberPage } from './changenumber.page';

describe('ChangenumberPage', () => {
  let component: ChangenumberPage;
  let fixture: ComponentFixture<ChangenumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangenumberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangenumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
