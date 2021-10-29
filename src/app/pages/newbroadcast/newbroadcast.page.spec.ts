import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewbroadcastPage } from './newbroadcast.page';

describe('NewbroadcastPage', () => {
  let component: NewbroadcastPage;
  let fixture: ComponentFixture<NewbroadcastPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewbroadcastPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewbroadcastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
