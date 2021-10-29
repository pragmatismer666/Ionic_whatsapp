import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupInfoEditePage } from './group-info-edite.page';

describe('GroupInfoEditePage', () => {
  let component: GroupInfoEditePage;
  let fixture: ComponentFixture<GroupInfoEditePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInfoEditePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupInfoEditePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
