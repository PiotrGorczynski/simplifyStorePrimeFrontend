import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAboutAuthorComponent } from './info-about-author';

describe('InfoAboutAuthor', () => {
  let component: InfoAboutAuthorComponent;
  let fixture: ComponentFixture<InfoAboutAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoAboutAuthorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoAboutAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
