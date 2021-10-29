import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupInfoPage } from './group-info.page';

describe('GroupInfoPage', () => {
  let component: GroupInfoPage;
  let fixture: ComponentFixture<GroupInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
