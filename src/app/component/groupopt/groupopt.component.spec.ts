import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupoptComponent } from './groupopt.component';

describe('GroupoptComponent', () => {
  let component: GroupoptComponent;
  let fixture: ComponentFixture<GroupoptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupoptComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupoptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
