import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnlargeImagePage } from './enlarge-image.page';

describe('EnlargeImagePage', () => {
  let component: EnlargeImagePage;
  let fixture: ComponentFixture<EnlargeImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnlargeImagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnlargeImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
