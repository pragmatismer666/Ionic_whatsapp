import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddmembersPage } from './addmembers.page';

describe('AddmembersPage', () => {
  let component: AddmembersPage;
  let fixture: ComponentFixture<AddmembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddmembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
