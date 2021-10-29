import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatsettingPage } from './chatsetting.page';

describe('ChatsettingPage', () => {
  let component: ChatsettingPage;
  let fixture: ComponentFixture<ChatsettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatsettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
