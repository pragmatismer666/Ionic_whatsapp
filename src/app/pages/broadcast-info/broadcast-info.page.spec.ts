import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BroadcastInfoPage } from './broadcast-info.page';

describe('BroadcastInfoPage', () => {
  let component: BroadcastInfoPage;
  let fixture: ComponentFixture<BroadcastInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BroadcastInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
