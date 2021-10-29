import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserpagePage } from './userpage.page';

describe('UserpagePage', () => {
  let component: UserpagePage;
  let fixture: ComponentFixture<UserpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
