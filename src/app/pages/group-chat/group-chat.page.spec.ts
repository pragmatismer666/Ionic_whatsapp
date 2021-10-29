import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupChatPage } from './group-chat.page';

describe('GroupChatPage', () => {
  let component: GroupChatPage;
  let fixture: ComponentFixture<GroupChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
