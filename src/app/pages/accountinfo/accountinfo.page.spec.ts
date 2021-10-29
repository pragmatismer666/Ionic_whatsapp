import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountinfoPage } from './accountinfo.page';

describe('AccountinfoPage', () => {
  let component: AccountinfoPage;
  let fixture: ComponentFixture<AccountinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
