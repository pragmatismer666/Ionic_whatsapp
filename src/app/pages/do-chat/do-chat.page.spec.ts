import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DoChatPage } from './do-chat.page';

describe('DoChatPage', () => {
  let component: DoChatPage;
  let fixture: ComponentFixture<DoChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DoChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
