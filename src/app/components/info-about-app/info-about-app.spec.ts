import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAboutAppComponent } from './info-about-app';

describe('InfoAboutApp', () => {
  let component: InfoAboutAppComponent;
  let fixture: ComponentFixture<InfoAboutAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoAboutAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoAboutAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
