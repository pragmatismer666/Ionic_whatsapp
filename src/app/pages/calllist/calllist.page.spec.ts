import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalllistPage } from './calllist.page';

describe('CalllistPage', () => {
  let component: CalllistPage;
  let fixture: ComponentFixture<CalllistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalllistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalllistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
