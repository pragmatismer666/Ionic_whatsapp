import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowStatusPage } from './show-status.page';

describe('ShowStatusPage', () => {
  let component: ShowStatusPage;
  let fixture: ComponentFixture<ShowStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
