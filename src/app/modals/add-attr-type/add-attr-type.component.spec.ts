import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttrTypeComponent } from './add-attr-type.component';

describe('AddAttrTypeComponent', () => {
  let component: AddAttrTypeComponent;
  let fixture: ComponentFixture<AddAttrTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttrTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttrTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
