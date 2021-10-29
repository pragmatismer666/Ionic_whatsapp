import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestinfoPage } from './requestinfo.page';

describe('RequestinfoPage', () => {
  let component: RequestinfoPage;
  let fixture: ComponentFixture<RequestinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
