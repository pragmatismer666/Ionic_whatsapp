import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewgroupPage } from './newgroup.page';

describe('NewgroupPage', () => {
  let component: NewgroupPage;
  let fixture: ComponentFixture<NewgroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewgroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewgroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
